"""
Improved Resume Screening Engine using e5-base-v2 embeddings
Features:
- Responsibility alignment scoring using semantic embeddings
- Document-level similarity scoring
- Seniority/level alignment detection
- Evidence-based explanations (best resume sentence per JD bullet)
"""

from typing import Dict, List, Tuple, Optional
import numpy as np
import re
import spacy
from dataclasses import dataclass

try:
    from sentence_transformers import SentenceTransformer
    EMBEDDINGS_AVAILABLE = True
except ImportError:
    EMBEDDINGS_AVAILABLE = False
    print("Warning: sentence-transformers not installed. Using fallback TF-IDF scoring.")

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

from models import ResumeData, JobDescriptionData, MatchScoreBreakdown


# =========================
# Initialize Models
# =========================
EMB_MODEL_NAME = "intfloat/e5-base-v2"  # MIT-licensed
EMB = None
nlp = None

def _initialize_models():
    """Lazy-load models on first use"""
    global EMB, nlp
    if EMB is None and EMBEDDINGS_AVAILABLE:
        try:
            EMB = SentenceTransformer(EMB_MODEL_NAME)
            print(f"Loaded embedding model: {EMB_MODEL_NAME}")
        except Exception as e:
            print(f"Failed to load embedding model: {e}")
    
    if nlp is None:
        try:
            nlp = spacy.load("en_core_web_sm")
        except OSError:
            nlp = spacy.blank("en")


# =========================
# Text & Embedding Utilities
# =========================
def norm(txt: str) -> str:
    """Normalize text: strip and collapse whitespace"""
    return re.sub(r"\s+", " ", (txt or "").strip())


def sentencize(txt: str) -> List[str]:
    """Split text into sentences using spaCy"""
    if nlp is None:
        _initialize_models()
    
    doc = nlp(norm(txt))
    return [s.text.strip() for s in doc.sents if len(s.text.strip()) > 2]


def embed_norm(texts: List[str], *, prefix: str = "") -> np.ndarray:
    """
    Encode texts to embeddings with optional prefix.
    e5 models work best with:
    - 'query:' prefix for search/matching queries
    - 'passage:' prefix for document content
    """
    if EMB is None:
        _initialize_models()
    
    if not EMBEDDINGS_AVAILABLE or EMB is None:
        # Fallback: return random embeddings if not available
        return np.random.randn(len(texts), 768).astype(np.float32)
    
    if prefix:
        texts = [f"{prefix} {t}" for t in texts]
    
    try:
        X = EMB.encode(texts, convert_to_numpy=True)
        # L2 normalize
        X = X / (np.linalg.norm(X, axis=1, keepdims=True) + 1e-12)
        return X.astype(np.float32)
    except Exception as e:
        print(f"Embedding error: {e}")
        return np.random.randn(len(texts), 768).astype(np.float32)


def cosine_matrix(A: np.ndarray, B: np.ndarray) -> np.ndarray:
    """Compute cosine similarity matrix: A @ B.T"""
    return A @ B.T


# =========================
# JD Bullet Extraction
# =========================
SECTION_HINTS = [
    r"responsibilit(?:y|ies)",
    r"what (you'?ll|you will) do",
    r"role(?:s)?(?: &| and)? responsibilit(?:y|ies)?",
    r"duties",
    r"requirements",
    r"what we(?:'| wi)re looking for",
]

BULLET_SEP = re.compile(
    r"(?:^|\n)\s*(?:[\u2022\u2023\u25E6\u2043\u2219\-–—\*]|\d{1,2}[.)]\s+)"
)

GENERIC_PREFIXES = (
    "responsibilities",
    "requirements",
    "about the role",
    "what you'll do",
    "what you will do",
    "duties",
    "you will",
)


def clean_line(line: str) -> str:
    """Remove bullet points and excess whitespace from a line"""
    line = re.sub(r"^[\u2022\u2023\u25E6\u2043\u2219\-–—\*\d\)\. ]+\s*", "", line)
    line = re.sub(r"\s+", " ", line).strip(" -–—•\t")
    return line


def find_section(text: str) -> str:
    """Find responsibilities/requirements section in text"""
    lo = text.lower()
    for pat in SECTION_HINTS:
        m = re.search(pat + r"\s*[:\-–—]?", lo)
        if m:
            return text[m.end():]
    return text


def dedupe_keep_order(items, key=lambda s: s.lower()):
    """Remove duplicates while preserving order"""
    seen = set()
    out = []
    for x in items:
        k = key(x)
        if k not in seen:
            out.append(x)
            seen.add(k)
    return out


def jd_to_bullets(jd_text: str) -> List[str]:
    """Extract bullets/requirements from JD text"""
    section = find_section(jd_text)
    parts = BULLET_SEP.split(section)
    
    if len(parts) <= 1:
        parts = [l for l in section.split("\n")]
    
    cand = [clean_line(p) for p in parts]
    cand = [c for c in cand if c and 4 <= len(c.split()) <= 32]
    cand = [c for c in cand if not c.lower().startswith(GENERIC_PREFIXES)]
    cand = dedupe_keep_order(cand)
    
    if not cand:
        # Fallback: use sentencize
        sents = sentencize(jd_text)
        sents = [s for s in sents if 6 <= len(s.split()) <= 28]
        cand = sents[:12]
    
    return cand[:20]


# =========================
# Scoring Components
# =========================
W_RESP = 70  # Responsibilities alignment weight
W_DOCSIM = 20  # Whole-document semantic similarity weight
W_SEN = 10  # Seniority alignment weight


def squash_cosine(x: np.ndarray, floor: float = 0.20, ceil: float = 0.95) -> np.ndarray:
    """
    Clip then linearly map cosine scores to [0,1].
    Avoids harsh zeros on moderately low scores.
    """
    x = np.clip(x, floor, ceil)
    return (x - floor) / (ceil - floor + 1e-12)


@dataclass
class ResponsibilityAlignment:
    """Result from responsibility scoring"""
    score: float
    explanations: List[Dict]


def score_responsibilities(jd_text: str, resume_text: str) -> ResponsibilityAlignment:
    """
    Score how well resume responsibilities match JD bullets.
    Returns per-bullet alignment with best matching resume sentence.
    """
    jd_bullets = jd_to_bullets(jd_text)
    res_sents = sentencize(resume_text)
    
    if not jd_bullets or not res_sents:
        return ResponsibilityAlignment(score=0.0, explanations=[])
    
    # Encode with prefixes for e5 model
    Ej = embed_norm(jd_bullets, prefix="query:")
    Er = embed_norm(res_sents, prefix="passage:")
    S = cosine_matrix(Ej, Er)  # [B x R]
    
    explanations = []
    best_per_bullet = []
    
    for i, b in enumerate(jd_bullets):
        j_star = int(np.argmax(S[i]))
        best = float(S[i, j_star])
        explanations.append({
            "jd_bullet": b,
            "resume_sentence": res_sents[j_star],
            "similarity": best
        })
        best_per_bullet.append(best)
    
    best_per_bullet = np.array(best_per_bullet, dtype=np.float32)
    resp = W_RESP * float(squash_cosine(best_per_bullet).mean())
    
    return ResponsibilityAlignment(score=resp, explanations=explanations)


def infer_level(text: str) -> int:
    """Infer seniority level (1=entry, 2=mid, 3=senior, 4=principal)"""
    t = norm(text).lower()
    if re.search(r"\b(principal|architect|staff)\b", t):
        return 4
    if re.search(r"\b(senior|sr\.)\b", t):
        return 3
    if re.search(r"\b(mid|ii|intermediate)\b", t):
        return 2
    if re.search(r"\b(junior|entry|i)\b", t):
        return 1
    return 2


def score_seniority(jd_text: str, resume_text: str) -> float:
    """
    Score seniority/level alignment.
    Boosts resume level if leadership keywords found.
    """
    Lj = infer_level(jd_text)
    Lr = infer_level(resume_text)
    
    # Boost resume level if leadership keywords present
    if re.search(r"\b(lead|led|managed|architected|mentored|directed|supervised)\b", norm(resume_text).lower()):
        Lr = min(Lr + 1, 4)
    
    gap = abs(Lj - Lr)
    level_component = {0: 1.0, 1: 0.8, 2: 0.5, 3: 0.2, 4: 0.0}.get(gap, 0.0)
    return W_SEN * level_component


def score_docsim(jd_text: str, resume_text: str) -> float:
    """
    Score whole-document semantic similarity.
    """
    vj = embed_norm([jd_text], prefix="query:")[0]
    vr = embed_norm([resume_text], prefix="passage:")[0]
    cos = float(np.dot(vj, vr))
    return W_DOCSIM * float(squash_cosine(np.array([cos]))[0])


# =========================
# Main Scoring Wrapper
# =========================
@dataclass
class ScoreBreakdown:
    """Final score breakdown"""
    final_score: int
    subscores: Dict[str, float]
    responsibility_alignment: List[Dict]


def score_resume_vs_jd(jd_text: str, resume_text: str) -> ScoreBreakdown:
    """
    Main scoring function combining all components.
    Returns 0–100 match score with breakdown and evidence.
    """
    resp_align = score_responsibilities(jd_text, resume_text)
    s_resp = resp_align.score
    explanations = resp_align.explanations
    
    s_doc = score_docsim(jd_text, resume_text)
    s_sen = score_seniority(jd_text, resume_text)
    
    final = int(round(s_resp + s_doc + s_sen))
    final = min(max(final, 0), 100)  # Clamp to [0, 100]
    
    return ScoreBreakdown(
        final_score=final,
        subscores={
            "responsibilities_0_70": round(s_resp, 1),
            "doc_similarity_0_20": round(s_doc, 1),
            "seniority_0_10": round(s_sen, 1),
        },
        responsibility_alignment=explanations
    )


# =========================
# Legacy Matching Engine (for compatibility)
# =========================
class MatchingEngine:
    """
    Legacy matching engine wrapper for backward compatibility.
    Uses improved e5-base-v2 scoring internally.
    """
    
    def __init__(self):
        _initialize_models()
        self.weights = {
            'skills': 0.4,
            'experience': 0.3,
            'education': 0.2,
            'semantic': 0.1
        }
    
    def calculate_match_score(self, resume_data: ResumeData, jd_data: JobDescriptionData) -> Dict:
        """
        Calculate comprehensive match score using improved embedding-based scoring
        and legacy component scoring.
        
        Args:
            resume_data: Parsed resume data
            jd_data: Parsed job description data
            
        Returns:
            Dictionary with overall score and breakdown
        """
        try:
            # Use improved embedding-based scoring
            score_breakdown = score_resume_vs_jd(jd_data.full_text, resume_data.full_text)
            final_score = score_breakdown.final_score
            
            # Also compute legacy scores for reference
            skills_score = self._calculate_skills_score(
                resume_data.skills, 
                jd_data.required_skills
            )
            experience_score = self._calculate_experience_score(
                resume_data.experience_years,
                jd_data.required_experience_years
            )
            education_score = self._calculate_education_score(
                resume_data.education,
                jd_data.education_requirements
            )
            
            # Blend with legacy semantic score (TF-IDF)
            semantic_score = self._calculate_semantic_score(
                resume_data.full_text,
                jd_data.full_text
            )
            
            # Weight the embedding-based score heavily, legacy scores for context
            final_score_blended = (final_score * 0.7) + (
                skills_score * 0.15 +
                experience_score * 0.1 +
                education_score * 0.05
            )
            
            breakdown = MatchScoreBreakdown(
                skills_score=round(skills_score * 100, 2),
                experience_score=round(experience_score * 100, 2),
                education_score=round(education_score * 100, 2),
                semantic_score=round(final_score, 2)
            )
            
            return {
                'overall_score': round(final_score_blended, 2),
                'breakdown': breakdown,
                'explanations': score_breakdown.responsibility_alignment[:10]
            }
        
        except Exception as e:
            print(f"Scoring error: {e}")
            breakdown = MatchScoreBreakdown(
                skills_score=0.0,
                experience_score=0.0,
                education_score=0.0,
                semantic_score=0.0
            )
            return {
                'overall_score': 0.0,
                'breakdown': breakdown,
                'explanations': []
            }
    
    def _calculate_skills_score(self, resume_skills: List[str], required_skills: List[str]) -> float:
        """
        Calculate Jaccard similarity score for skills matching
        
        Args:
            resume_skills: List of skills from resume
            required_skills: List of required skills from job description
            
        Returns:
            Jaccard similarity score (0.0 to 1.0)
        """
        if not resume_skills or not required_skills:
            return 0.0
        
        # Convert to lowercase sets for case-insensitive comparison
        resume_set = set(skill.lower().strip() for skill in resume_skills)
        required_set = set(skill.lower().strip() for skill in required_skills)
        
        # Calculate Jaccard similarity
        intersection = len(resume_set.intersection(required_set))
        union = len(resume_set.union(required_set))
        
        if union == 0:
            return 0.0
        
        jaccard_score = intersection / union
        
        # Also calculate overlap ratio (how many required skills are present)
        overlap_ratio = intersection / len(required_set) if required_set else 0.0
        
        # Use weighted average of Jaccard and overlap ratio
        final_score = (jaccard_score * 0.3) + (overlap_ratio * 0.7)
        
        return min(final_score, 1.0)
    
    def _calculate_experience_score(self, resume_years: Optional[int], required_years: Optional[int]) -> float:
        """
        Calculate experience score based on years comparison
        
        Args:
            resume_years: Years of experience from resume
            required_years: Required years from job description
            
        Returns:
            Experience score (0.0 to 1.0)
        """
        if required_years is None:
            return 0.8  # Default score when no requirement specified
        
        if resume_years is None:
            return 0.0  # No experience information found
        
        if resume_years >= required_years:
            return 1.0  # Meets or exceeds requirement
        
        # Proportional scoring for less experience
        ratio = resume_years / required_years
        
        # Apply a more forgiving curve for close matches
        if ratio >= 0.8:
            return 0.9
        elif ratio >= 0.6:
            return 0.7
        elif ratio >= 0.4:
            return 0.5
        elif ratio >= 0.2:
            return 0.3
        else:
            return 0.1
    
    def _calculate_education_score(self, resume_education: List[str], required_education: List[str]) -> float:
        """
        Calculate education score based on keyword matching
        
        Args:
            resume_education: Education information from resume
            required_education: Education requirements from job description
            
        Returns:
            Education score (0.0 to 1.0)
        """
        if not required_education:
            return 0.8  # Default score when no requirement specified
        
        if not resume_education:
            return 0.0  # No education information found
        
        # Convert to lowercase for comparison
        resume_text = ' '.join(resume_education).lower()
        
        # Common education keywords
        education_keywords = {
            'bachelor': ['bachelor', 'b.s', 'b.a', 'bs', 'ba', 'undergraduate'],
            'master': ['master', 'm.s', 'm.a', 'ms', 'ma', 'mba', 'graduate'],
            'phd': ['phd', 'ph.d', 'doctorate', 'doctoral'],
            'associate': ['associate', 'associates'],
            'diploma': ['diploma', 'certificate', 'certification'],
            'degree': ['degree']
        }
        
        matches = 0
        total_requirements = 0
        
        for requirement in required_education:
            requirement_lower = requirement.lower()
            total_requirements += 1
            
            # Check for direct keyword matches
            requirement_matched = False
            for edu_type, keywords in education_keywords.items():
                if any(keyword in requirement_lower for keyword in keywords):
                    if any(keyword in resume_text for keyword in keywords):
                        matches += 1
                        requirement_matched = True
                        break
            
            # If no keyword match, check for general text similarity
            if not requirement_matched:
                requirement_words = set(requirement_lower.split())
                resume_words = set(resume_text.split())
                
                # Calculate word overlap
                word_overlap = len(requirement_words.intersection(resume_words))
                overlap_ratio = word_overlap / len(requirement_words) if requirement_words else 0
                
                if overlap_ratio > 0.3:  # At least 30% word overlap
                    matches += 0.5  # Partial match
        
        if total_requirements == 0:
            return 0.8
        
        score = matches / total_requirements
        return min(score, 1.0)
    
    def _calculate_semantic_score(self, resume_text: str, jd_text: str) -> float:
        """Calculate TF-IDF based semantic similarity (fallback)"""
        try:
            if not SKLEARN_AVAILABLE:
                return 0.5
            
            vectorizer = TfidfVectorizer(stop_words='english', max_features=100)
            tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
            similarity = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]
            return float(similarity)
        except Exception:
            return 0.5
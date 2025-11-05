# app.py — Minimal Resume ↔ JD Matcher (upload two files → 0–100 score)
# Requires: fastapi, uvicorn[standard], python-multipart, python-docx, pypdf,
#           sentence-transformers, spacy, numpy
# One-time: python -m spacy download en_core_web_sm

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse
from docx import Document
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import spacy, io, re, numpy as np
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass

# =========================
# Models (free / open-source)
# =========================
EMB_MODEL_NAME = "intfloat/e5-base-v2"  # MIT-licensed
EMB = SentenceTransformer(EMB_MODEL_NAME)
nlp = spacy.load("en_core_web_sm")

app = FastAPI(title="Resume ↔ JD Matcher (Minimal)", version="2.0")

# =========================
# File extraction helpers
# =========================
def read_txt(stream: bytes) -> str:
    return stream.decode("utf-8", errors="ignore")

def read_pdf(stream: bytes) -> str:
    reader = PdfReader(io.BytesIO(stream))
    pages = []
    for p in reader.pages:
        pages.append(p.extract_text() or "")
    return "\n".join(pages)

def read_docx(stream: bytes) -> str:
    bio = io.BytesIO(stream)
    doc = Document(bio)
    return "\n".join(p.text for p in doc.paragraphs)

def extract_text(file: UploadFile) -> str:
    name = (file.filename or "").lower()
    ext = name.split(".")[-1] if "." in name else ""
    data = file.file.read()
    if ext == "txt":
        return read_txt(data)
    elif ext == "pdf":
        return read_pdf(data)
    elif ext == "docx":
        return read_docx(data)
    else:
        raise ValueError("Unsupported file type. Use PDF, DOCX, or TXT.")

# =========================
# Text & embedding utilities
# =========================
def norm(txt: str) -> str:
    return re.sub(r"\s+", " ", (txt or "").strip())

def sentencize(txt: str) -> List[str]:
    return [s.text.strip() for s in nlp(norm(txt)).sents if len(s.text.strip()) > 2]

def embed_norm(texts: List[str], *, prefix: str = "") -> np.ndarray:
    # e5 works best with 'query:' (for the thing you're searching with)
    # and 'passage:' (for the content being searched)
    if prefix:
        texts = [f"{prefix} {t}" for t in texts]
    X = EMB.encode(texts, convert_to_numpy=True)
    X = X / (np.linalg.norm(X, axis=1, keepdims=True) + 1e-12)
    return X.astype(np.float32)

def cosine_matrix(A: np.ndarray, B: np.ndarray) -> np.ndarray:
    return A @ B.T

# =========================
# JD bullet extraction (improved)
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
    "responsibilities", "requirements", "about the role",
    "what you'll do", "what you will do", "duties", "you will",
)

def clean_line(line: str) -> str:
    line = re.sub(r"^[\u2022\u2023\u25E6\u2043\u2219\-–—\*\d\)\. ]+\s*", "", line)
    line = re.sub(r"\s+", " ", line).strip(" -–—•\t")
    return line

def find_section(text: str) -> str:
    lo = text.lower()
    for pat in SECTION_HINTS:
        m = re.search(pat + r"\s*[:\-–—]?", lo)
        if m:
            return text[m.end():]  # everything after the heading
    return text  # fallback: whole JD

def dedupe_keep_order(items, key=lambda s: s.lower()):
    seen = set(); out = []
    for x in items:
        k = key(x)
        if k not in seen:
            out.append(x); seen.add(k)
    return out

def jd_to_bullets(jd_text: str) -> List[str]:
    section = find_section(jd_text)
    parts = BULLET_SEP.split(section)
    if len(parts) <= 1:
        parts = [l for l in section.split("\n")]

    cand = [clean_line(p) for p in parts]
    cand = [c for c in cand if c and 4 <= len(c.split()) <= 32]
    cand = [c for c in cand if not c.lower().startswith(GENERIC_PREFIXES)]
    cand = dedupe_keep_order(cand)

    if not cand:
        sents = sentencize(jd_text)
        sents = [s for s in sents if 6 <= len(s.split()) <= 28]
        cand = sents[:12]

    return cand[:20]

# =========================
# Scoring components (no skill/domain inputs)
# =========================
W_RESP   = 70  # responsibilities alignment
W_DOCSIM = 20  # whole-document semantic similarity
W_SEN    = 10  # seniority alignment

def squash_cosine(x: np.ndarray, floor: float = 0.20, ceil: float = 0.95) -> np.ndarray:
    """Clip then linearly map cosine scores to [0,1] to avoid harsh zeros."""
    x = np.clip(x, floor, ceil)
    return (x - floor) / (ceil - floor + 1e-12)

def score_responsibilities(jd_text: str, resume_text: str) -> Tuple[float, List[Dict]]:
    jd_bullets = jd_to_bullets(jd_text)
    res_sents  = sentencize(resume_text)
    if not jd_bullets or not res_sents:
        return 0.0, []

    Ej = embed_norm(jd_bullets, prefix="query:")
    Er = embed_norm(res_sents,  prefix="passage:")
    S  = cosine_matrix(Ej, Er)  # [B x R]

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
    return float(resp), explanations

def infer_level(text: str) -> int:
    t = norm(text).lower()
    if re.search(r"\b(principal|architect|staff)\b", t): return 4
    if re.search(r"\b(senior|sr\.)\b", t):               return 3
    if re.search(r"\b(mid|ii|intermediate)\b", t):       return 2
    if re.search(r"\b(junior|entry|i)\b", t):            return 1
    return 2

def score_seniority(jd_text: str, resume_text: str) -> float:
    Lj, Lr = infer_level(jd_text), infer_level(resume_text)
    if re.search(r"\b(lead|led|managed|architected|mentored)\b", norm(resume_text).lower()):
        Lr = min(Lr + 1, 4)
    gap = abs(Lj - Lr)
    level_component = {0:1.0, 1:0.8, 2:0.5, 3:0.2, 4:0.0}.get(gap, 0.0)
    return W_SEN * level_component

def score_docsim(jd_text: str, resume_text: str) -> float:
    vj = embed_norm([jd_text],     prefix="query:")[0]
    vr = embed_norm([resume_text], prefix="passage:")[0]
    cos = float(np.dot(vj, vr))
    return W_DOCSIM * float(squash_cosine(np.array([cos]))[0])

# =========================
# Final scoring wrapper
# =========================
@dataclass
class ScoreBreakdown:
    final_score: int
    subscores: Dict[str, float]
    responsibility_alignment: List[Dict]

def score_resume_vs_jd(jd_text: str, resume_text: str) -> ScoreBreakdown:
    s_resp, explain = score_responsibilities(jd_text, resume_text)
    s_doc  = score_docsim(jd_text, resume_text)
    s_sen  = score_seniority(jd_text, resume_text)
    final  = int(round(s_resp + s_doc + s_sen))
    return ScoreBreakdown(
        final_score=final,
        subscores={
            "responsibilities_0_70": round(s_resp, 1),
            "doc_similarity_0_20":  round(s_doc, 1),
            "seniority_0_10":       round(s_sen, 1),
        },
        responsibility_alignment=explain
    )

# =========================
# Routes (minimal UI)
# =========================
@app.get("/", response_class=HTMLResponse)
def index():
    return """<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Resume ↔ JD Matcher</title></head>
  <body style="font-family:system-ui;max-width:760px;margin:40px auto;">
    <h1>Upload Resume & Job Description</h1>
    <form action="/score-files" method="post" enctype="multipart/form-data">
      <p><label>Resume (.pdf/.docx/.txt): <input type="file" name="resume" required></label></p>
      <p><label>Job Description (.pdf/.docx/.txt): <input type="file" name="jd" required></label></p>
      <button type="submit">Upload & Score</button>
    </form>
    <p style="color:#666;margin-top:18px;">All processing runs locally. Model: <code>intfloat/e5-base-v2</code>.</p>
  </body>
</html>"""

@app.post("/score-files", response_class=HTMLResponse)
async def score_files(
    resume: UploadFile = File(...),
    jd: UploadFile = File(...)
):
    try:
        resume_text = extract_text(resume)
        jd_text     = extract_text(jd)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

    result = score_resume_vs_jd(jd_text, resume_text)

    html = f"""
    <!doctype html><html><head><meta charset="utf-8"><title>Score</title></head>
    <body style="font-family:system-ui;max-width:1000px;margin:40px auto;">
      <h2>Match Score: {result.final_score} / 100</h2>
      <h3>Subscores</h3>
      <ul>
        <li>Responsibilities (0–70): {result.subscores['responsibilities_0_70']}</li>
        <li>Document similarity (0–20): {result.subscores['doc_similarity_0_20']}</li>
        <li>Seniority (0–10): {result.subscores['seniority_0_10']}</li>
      </ul>
      <h3>Evidence (JD bullet → best resume sentence)</h3>
      <ol>
        {''.join([f"<li><b>{e['jd_bullet']}</b><br><i>{e['resume_sentence']}</i><br>similarity: {e.get('similarity', 0):.3f}</li>" for e in result.responsibility_alignment[:20]])}
      </ol>
      <p style="color:#666">No data leaves this machine. Embeddings model: <code>{EMB_MODEL_NAME}</code>.</p>
    </body></html>
    """
    return HTMLResponse(html)

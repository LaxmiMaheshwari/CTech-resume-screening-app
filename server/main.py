"""
Resume Screening Flask API Server
Migrated from FastAPI to Flask with semantic matching using e5-base-v2 embeddings
"""

from flask import Flask, request, jsonify, redirect, session, make_response
from flask_cors import CORS
# from werkzeug.utils import secure_filename
import secrets
import os
from functools import wraps
from datetime import timedelta

from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv



from langchain_google_vertexai import VertexAI
from vertexai.language_models import TextEmbeddingModel
import vertexai
import numpy as np
from PyPDF2 import PdfReader
import docx
import json
import time
from google.auth.transport import requests 
from google.oauth2 import id_token




# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(
    __name__,
    instance_relative_config=True
)

CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:4200"}})

PROJECT_ID = os.getenv("GCP_PROJECT_ID")
LOCATION = os.getenv("GCP_REGION")

vertexai.init(project=PROJECT_ID, location=LOCATION)

embedding_model = TextEmbeddingModel.from_pretrained("text-embedding-004")
# llm = TextGenerationModel.from_pretrained("gemini-1.5-flash-001")
llm = VertexAI(
    model="gemini-2.0-flash-001",
    project=PROJECT_ID,
    location=LOCATION,
    temperature=0.1
)


# Configure app
app.config['SECRET_KEY'] = secrets.token_hex(32)
app.config.update(
    SESSION_COOKIE_NAME="session",
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=True,           # Must be True for SameSite=None
    SESSION_COOKIE_SAMESITE="None",       # Allow cross-origin
)

app.config['UPLOAD_EXTENSIONS'] = {'pdf', 'docx', 'txt'}

# Enable CORS
CORS(
    app,
    origins=['*'],
    allow_headers=['Content-Type', 'Authorization'],
    supports_credentials=True
)

# Initialize components
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI  = os.getenv("GOOGLE_REDIRECT_URI")  #demo
COOKIE_SECURE= True
COOKIE_DOMAIN = "localhost"
ALLOWED_DOMAIN = ["latentview.com"]
# GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:5000/callback")

COOKIE_NAME = "nirvana_mapping_id"
# COOKIE_SECURE = os.getenv("COOKIE_SECURE", "False").lower() == "true"
COOKIE_HTTPONLY = True
# COOKIE_DOMAIN = os.getenv("COOKIE_DOMAIN", "localhost")

# Initialize OAuth
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid profile email'},
    authorize_params={'access_type': 'offline'},
    redirect_uri=GOOGLE_REDIRECT_URI
)

# Utility functions
def generate_mapping_id():
    """Generate a secure mapping ID for session"""
    return secrets.token_urlsafe(32)

def token_required(f):
    """
    Wrapper function to protect endpoints by verifying the mapping_id in cookies
    and validating the id_token in the session.
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        print(
            "Token Required Wrapper : Checking if the session is inactive and redirecting to the sign in page if the session is inactive")
        print("session")
        print(session)
        if "user_info" not in session:
            response = make_response("Unauthorized: Session Expired", 401)
            response.delete_cookie(
                COOKIE_NAME,
                httponly=COOKIE_HTTPONLY,
                secure=COOKIE_SECURE,
                domain=COOKIE_DOMAIN
            )
            return response

        # Extract mapping_id from the request cookies
        print("Token Required Wrapper : Session seems active. Hence fetching the mapping id from the cookies & email and access token expiration time from session")
        mapping_id_from_cookie = request.cookies.get("nirvana_mapping_id")
        email_from_session = session.get("email")
        expires_at = session.get('expires_at')
        remaining_time = expires_at - time.time()
        print("Token Expiry Debug: expires_at =", session.get("expires_at"), " Current Time:", time.time())

        if remaining_time <= 0:
            print("Token Required Wrapper : Session seems active but the token has expired")
            return redirect('/renew')

        print("Token Required Wrapper : Session seems active and the token is also active")
        # Validate the mapping_id
        if (not mapping_id_from_cookie):
            print("Token Required Wrapper : Session is active but the mapping id is missing")
            return "Unauthorized: Missing mapping ID", 401
        else:
            try:
                print(
                    "Token Required Wrapper : Session is active, mapping id is extracted from the cookie & now extracting the ID token from the session for the respective mapping id")
                id_token_from_session = session.get(mapping_id_from_cookie)
            except:
                logger.exception(
                    "Token Required Wrapper : Session is active, mapping id is extracted from the cookie but it seems invalid")
                return "Unauthorized: Missing or Invalid mapping ID", 401

        # Validate the google id_token
        try:
            print(
                "Verifies the validity of the ID token, checking things like its signature, expiration time, and audience to ensure that it is a legitimate token issued by Google for your app.")
            request_session = requests.Request()
            id_info = id_token.verify_oauth2_token(id_token_from_session, request_session, audience=GOOGLE_CLIENT_ID)
        except ValueError:
            return "Unauthorized: Invalid id_token", 401

        print("ID token is validated and ID info is as follows:")
        print(id_info)

        # Validate email and domain
        print("Validating the email & domain in the session with that of ID token's")
        if (not email_from_session) or (email_from_session != id_info['email']) or id_info['hd'] not in ALLOWED_DOMAIN:
            return "Unauthorized: Invalid email", 401

        # If validation passes, proceed to the original function
        print("Validation passed! Proceeds to the original function")
        return f(*args, **kwargs)

    return decorated_function


def login_required(f):
    """Decorator to check if user is logged in"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_info = session.get('user_info')
        if not user_info:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function


def allowed_file(filename):
    """Check if file has allowed extension"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['UPLOAD_EXTENSIONS']

def is_from_ui_port_4200():
    origin = request.headers.get('Origin', '')
    referer = request.headers.get('Referer', '')
    
    # Check if either Origin or Referer starts with localhost:4200
    return (
        origin.startswith('http://localhost:4200') or
        referer.startswith('http://localhost:4200')
    )


# Routes - Authentication
@app.route('/auth/google')
def auth_google():
    """Initiate Google OAuth login"""
    try:
        session['is_from_localhost'] = is_from_ui_port_4200()
        redirect_uri = GOOGLE_REDIRECT_URI
        print(f"Redirecting to Google with redirect_uri: {redirect_uri}")
        return google.authorize_redirect(redirect_uri=redirect_uri, prompt="select_account", access_type="offline")

    except Exception as e:
        print(f"Error initiating Google auth: {e}")
        return jsonify({'error': 'Failed to initiate authentication'}), 500
    



@app.route('/callback', methods=['GET'])
def callback():
    print("Callback request args:", request.args)  # Debugging

    try:
        token = google.authorize_access_token()
        # print("Token received:", token)  # Debugging
        id_token = token.get('id_token')
        # print("ID Token : ", id_token)
        user_info = token.get("userinfo")
        # print("User Info : ", user_info)
        expires_at = token.get('expires_at')
        # print("Expires At : ", expires_at)
        print(user_info)
        if user_info['hd'] not in ALLOWED_DOMAIN:
            return "Access restricted to specific domain users", 401

        if not user_info:
            return jsonify({"error": "Failed to fetch user info"}), 401
        
        user_id = user_info.get("email")
        print("User ID:", user_id)  # Debugging
        session['user_id'] = user_id  # Store in session
        print(session)
        # return jsonify({"message": "Login successful", "user_id": user_id})
        # return redirect("https://ctech-growthopscore.el.r.appspot.com")
        # Create a response object
        # Create a session mapping ID
        # Create a session mapping ID
        mapping_id = generate_mapping_id()
        # Store the mapping ID and user email in Flask session
        session[mapping_id] = id_token
        session['user_info'] = user_info
        session["name"] = user_info['name']
        session["email"] = user_info['email']
        session['expires_at'] = expires_at
        # response = make_response(redirect("https://ctechbot-dev-dot-ctech-growthopscore.el.r.appspot.com"))        
        response = make_response(redirect("http://localhost:4200"))   

        if session.get('is_from_localhost'):
            response = make_response(redirect("http://localhost:4200"))
        else:
            response = make_response(redirect("https://resume-screening-dev-dot-b2c-de.uc.r.appspot.com"))
     

        # Set a secure HTTP-only cookie (expires in 1 day)
        # response.set_cookie(
        #     COOKIE_NAME,
        #     mapping_id,
        #     httponly=COOKIE_HTTPONLY,
        #     secure=COOKIE_SECURE,
        #     domain=COOKIE_DOMAIN            
        # )  

        response.set_cookie(
            COOKIE_NAME,
            mapping_id,
            httponly=COOKIE_HTTPONLY,
            secure=COOKIE_SECURE,
            samesite='None'           
        )  
  
        print("response")
        print(response)  
        print("response end")
        print("Setting cookie:", response.headers.get("Set-Cookie"))

        return response

    except Exception as e:
        print(f"Error during Google OAuth callback: {e}")
        return "Authentication failed!", 401


@app.route('/user')
@token_required
def user():
    print("User End point : Hitting User end point to fetch the user details stored in the session")
    if 'user_info' in session:
        print("User End point : Session seems active")
        user_info = session.get('user_info')
        keys_to_filter = ['email', 'email_verified', 'family_name', 'given_name', 'hd', 'name', 'picture', 'sub']
        user_info_ui = {key: user_info[key] for key in keys_to_filter if key in user_info}
        return jsonify(user_info_ui)
    else:
        print("User End point : Session seems inactive, redirecting to the Signin page")
        response = make_response("Unauthorized: Session Expired", 401)
        response.delete_cookie(
            COOKIE_NAME,
            httponly=COOKIE_HTTPONLY,
            secure=COOKIE_SECURE,
            domain=COOKIE_DOMAIN
        )
        return response


@app.route('/signout', methods=['GET', 'POST'])
def logout():
    # session.clear()
    # response.delete_cookie(
    #     COOKIE_NAME,
    #     httponly=COOKIE_HTTPONLY,
    #     secure=COOKIE_SECURE,
    #     domain=COOKIE_DOMAIN
    # )
    # return redirect("/")
    print("Signout Endpoint : Clearing the session, redirecting to the SignIn page and clearing both session cookie and bnc mapping id cookie")
    session.clear()
    # response = make_response(redirect("https://ctechbot-dev-dot-ctech-growthopscore.el.r.appspot.com/signin")) #demo
    # response = make_response(redirect("http://localhost:4200/signin")) #demo

    if session.get('is_from_localhost'):
            response = make_response(redirect("http://localhost:4200"))
    else:
            response = make_response(redirect("https://resume-screening-dev-dot-b2c-de.uc.r.appspot.com"))
     

    response.delete_cookie(
            COOKIE_NAME,
            httponly=COOKIE_HTTPONLY,
            secure=COOKIE_SECURE,
            domain=COOKIE_DOMAIN
        )
    return response


# Routes - Core API
@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        'message': 'Resume Screening API (Flask)',
        'version': '2.0',
        'framework': 'Flask',
        'endpoints': {
            'screen_resume': '/screen_resume',
            'health': '/health',
            'auth': '/auth/google',
            'user': '/user'
        }
    }), 200


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Resume Screening API',
        'framework': 'Flask'
    }), 200



def extract_text_from_pdf(file):
    reader = PdfReader(file)
    return " ".join([page.extract_text() or "" for page in reader.pages])


def extract_text_from_docx(file):
    document = docx.Document(file)
    return " ".join([p.text for p in document.paragraphs])


def extract_text(file):
    name = file.filename.lower()

    if name.endswith(".pdf"):
        return extract_text_from_pdf(file)

    elif name.endswith(".docx"):
        return extract_text_from_docx(file)

    elif name.endswith(".txt"):
        return file.read().decode("utf-8")

    return None


def embed(text):
    return np.array(embedding_model.get_embeddings([text])[0].values)

def cosine(a, b):
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def score_section(resume_txt, jd_txt):
    if not resume_txt or not jd_txt:
        return 0

    emb_r = embed(resume_txt)
    emb_j = embed(jd_txt)

    return round(cosine(emb_r, emb_j) * 100, 2)


def calculate_breakdown(resume_text, jd_text):
    print("9")
    resume = extract_sections(resume_text)
    print("resume")
    print(resume)
    jd = extract_sections(jd_text)
    print("jd")
    print(jd)

    breakdown = {
        "education": score_section(resume["education"], jd["education"]),
        "technical_skills": score_section(resume["technical_skills"], jd["technical_skills"]),
        "soft_skills": score_section(resume["soft_skills"], jd["soft_skills"]),
        "experience": score_section(resume["experience"], jd["experience"]),
    }
    print("1")

    # Weighted overall score
    weights = {
        "education": 0.15,
        "technical_skills": 0.5,
        "soft_skills": 0.15,
        "experience": 0.20
    }
    print("2")


    overall = sum(breakdown[key] * weights[key] for key in breakdown)

    # Skill gap
    resume_sk = set(extract_skills(resume_text))
    jd_sk = set(extract_skills(jd_text))

    missing = list(jd_sk - resume_sk)
    extra = list(resume_sk - jd_sk)

    return {
        "overall_match": round(overall, 2),
        "breakdown": breakdown,
        "missing_skills": missing,
        "extra_skills": extra,
    }



# ---------------- EMBEDDING + COSINE SIMILARITY ---------------- #

def get_embedding(text):
    emb = embedding_model.get_embeddings([text])[0].values
    return np.array(emb)


def cosine(a, b):
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))



def extract_sections_safe(response):
    text = response.strip()

    print("hello 1")
    print("text")
    print(text)
    
    # Remove Markdown code fences if present
    if text.startswith("```"):
        # Split by ``` and take the middle part
        lines = text.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]  # remove opening ```
        # Remove last line if it is ```
        if lines[-1].strip() == "```":
            lines = lines[:-1]
        # Join back to a single string
        text = "\n".join(lines).strip()
    
    try:
        print("hello2")
        print("text")
        print(text)
        data = json.loads(text)
        print("data")
        print(data)
    except json.JSONDecodeError:
        # fallback: return raw text if parsing fails
        data = {"raw_text": text}
    
    return data

# ---------------- SECTION EXTRACTION USING LLM ---------------- #

def extract_sections(text):
    prompt = f"""
    Return ONLY valid JSON in this format:
    {{
        "education": "...",
        "technical_skills": "...",
        "soft_skills": "...",
        "experience": "..."
    }}
    
    Text:
    {text}
    """

    print("10")
    response = llm.invoke(prompt)
    return extract_sections_safe(response)
    

# ---------------- SKILL EXTRACTION ---------------- #

def extract_skills(text):
    prompt = f"""
    Extract ALL technical skills from the text. Return JSON array only.

    Text: {text}
    """

    response = llm.invoke(prompt)
    import json
    try:
        return json.loads(response)
    except:
        return []


# ---------------- MAIN MATCH FUNCTION ---------------- #

@app.route('/screen_resume', methods=['POST'])
# @login_required
def screen_resume():
    try:
        # Check if files are present
        print("1")
        if 'resume_file' not in request.files:
            return jsonify({'error': 'resume_file is required'}), 400
        
        if 'jd_file' not in request.files:
            return jsonify({'error': 'jd_file is required'}), 400
        
        print("2")
        
        resume_file = request.files['resume_file']
        print("3")

        jd_file = request.files['jd_file']

        print("31")
        
        # Check if files are empty
        if resume_file.filename == '' or jd_file.filename == '':
            return jsonify({'error': 'Files must not be empty'}), 400
        
        # Check file extensions
        if not (allowed_file(resume_file.filename) and allowed_file(jd_file.filename)):
            return jsonify({
                'error': 'Invalid file type. Allowed types: PDF, DOCX, TXT'
            }), 400
        
        print("4")

        
        # # Reset file pointers
        # resume_file.seek(0)
        # print("4")

        # jd_file.seek(0)
        #  print("4")

        
        # Parse files
        try:
            # resume_data = resume_parser.parse_resume(resume_file)
            # jd_data = resume_parser.parse_job_description(jd_file)
            print("5")

            resume_text = extract_text(resume_file)
            print("6")
            jd_text = extract_text(jd_file)
            print("7")

            if not resume_text or not jd_text:
                return jsonify({"error": "Failed to extract text"}), 400
            print("8")

            result = calculate_breakdown(resume_text, jd_text)
            return jsonify(result)


        except Exception as e:
            return jsonify({'error': str(e)}), 400
        
    except Exception as e:
            print(f"Error in screen_resume: {e}")
            return jsonify({
                'error': 'An error occurred while processing the request',
                'details': str(e)
            }), 500


# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500


@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large errors"""
    return jsonify({'error': 'File too large. Maximum size is 16MB'}), 413


if __name__ == '__main__':
    # Development server
    print("\n" + "="*60)
    print("Resume Screening API (Flask)")
    print("="*60)
    print(f"Server starting on http://0.0.0.0:5000")
    print(f"Documentation: http://localhost:5000")
    print(f"Health check: http://localhost:5000/health")
    print("="*60 + "\n")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=True
    )
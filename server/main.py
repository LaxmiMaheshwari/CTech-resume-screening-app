"""
Resume Screening Flask API Server
Migrated from FastAPI to Flask with semantic matching using e5-base-v2 embeddings
"""

from flask import Flask, request, jsonify, redirect, session
from flask_cors import CORS
from werkzeug.utils import secure_filename
import secrets
import os
from functools import wraps
from datetime import timedelta

from models import ScreeningResponse, MatchScoreBreakdown, ResumeData, JobDescriptionData
from resume_parser import ResumeParser, ParserException
from matching_engine import MatchingEngine
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(
    __name__,
    instance_relative_config=True
)

# Configure app
app.config['SECRET_KEY'] = secrets.token_hex(32)
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_EXTENSIONS'] = {'pdf', 'docx', 'txt'}

# Enable CORS
CORS(
    app,
    origins=['*'],
    allow_headers=['Content-Type', 'Authorization'],
    supports_credentials=True
)

# Initialize components
resume_parser = ResumeParser()
matching_engine = MatchingEngine()

# Get environment variables
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

ALLOWED_DOMAIN = ["latentview.com"]
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:5000/callback")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:4200")

COOKIE_NAME = "nirvana_mapping_id"
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "False").lower() == "true"
COOKIE_HTTPONLY = True
COOKIE_DOMAIN = os.getenv("COOKIE_DOMAIN", "localhost")

# Initialize OAuth
oauth = OAuth(app)
oauth.register(
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


# Routes - Authentication
@app.route('/auth/google', methods=['GET'])
def auth_google():
    """Initiate Google OAuth login"""
    try:
        redirect_uri = GOOGLE_REDIRECT_URI
        print(f"Redirecting to Google with redirect_uri: {redirect_uri}")
        return oauth.google.authorize_redirect(redirect_uri)
    except Exception as e:
        print(f"Error initiating Google auth: {e}")
        return jsonify({'error': 'Failed to initiate authentication'}), 500


@app.route('/callback', methods=['GET'])
def callback():
    """Google OAuth callback handler"""
    try:
        token = oauth.google.authorize_access_token()
        
        if not token:
            print("No token received from OAuth")
            return jsonify({'error': 'Failed to get token'}), 401
        
        user_info = token.get('userinfo')
        
        if not user_info:
            print("No user info in token")
            return jsonify({'error': 'Failed to fetch user info'}), 401
        
        # Check domain restriction
        if user_info.get('hd') not in ALLOWED_DOMAIN:
            print(f"Domain restriction failed: {user_info.get('hd')} not in {ALLOWED_DOMAIN}")
            return jsonify({'error': 'Access restricted to specific domain users'}), 401
        
        # Store in session
        session.permanent = True
        mapping_id = generate_mapping_id()
        
        session[mapping_id] = token.get('id_token')
        session['user_info'] = {
            'email': user_info.get('email'),
            'name': user_info.get('name'),
            'family_name': user_info.get('family_name'),
            'given_name': user_info.get('given_name'),
            'picture': user_info.get('picture'),
            'email_verified': user_info.get('email_verified'),
            'hd': user_info.get('hd'),
            'sub': user_info.get('sub')
        }
        
        print(f"User logged in: {user_info.get('email')}")
        
        # Redirect to frontend
        response = redirect(f"{FRONTEND_URL}?session_id={mapping_id}")
        response.set_cookie(
            COOKIE_NAME,
            mapping_id,
            httponly=COOKIE_HTTPONLY,
            secure=COOKIE_SECURE,
            samesite='Lax',
            max_age=86400  # 1 day
        )
        
        return response
    
    except Exception as e:
        print(f"Error during Google OAuth callback: {e}")
        return jsonify({'error': 'Authentication failed', 'details': str(e)}), 401


@app.route('/user', methods=['GET'])
def get_user():
    """Get current user information"""
    print("User endpoint: fetching user details from session")
    
    user_info = session.get('user_info')
    
    if user_info:
        print("User endpoint: session is active")
        return jsonify(user_info), 200
    
    print("User endpoint: session is inactive, redirecting to signin")
    return jsonify({'error': 'Unauthorized'}), 401


@app.route('/signout', methods=['GET', 'POST'])
def logout():
    """Sign out the current user"""
    print("Signout endpoint: clearing session")
    
    session.clear()
    
    response = jsonify({'message': 'Logged out successfully'})
    response.delete_cookie(COOKIE_NAME, samesite='Lax')
    
    return response, 200


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


@app.route('/screen_resume', methods=['POST'])
@login_required
def screen_resume():
    """
    Screen a resume against a job description and return match scores
    
    Expected form data:
    - resume_file: Resume file (PDF, DOCX, or TXT)
    - jd_file: Job description file (PDF, DOCX, or TXT)
    
    Returns:
    - overall_match_percentage: 0-100 match score
    - breakdown: Detailed scoring breakdown
    - explanations: Per-bullet matching evidence
    - message: Human-readable assessment
    """
    try:
        # Check if files are present
        if 'resume_file' not in request.files:
            return jsonify({'error': 'resume_file is required'}), 400
        
        if 'jd_file' not in request.files:
            return jsonify({'error': 'jd_file is required'}), 400
        
        resume_file = request.files['resume_file']
        jd_file = request.files['jd_file']
        
        # Check if files are empty
        if resume_file.filename == '' or jd_file.filename == '':
            return jsonify({'error': 'Files must not be empty'}), 400
        
        # Check file extensions
        if not (allowed_file(resume_file.filename) and allowed_file(jd_file.filename)):
            return jsonify({
                'error': 'Invalid file type. Allowed types: PDF, DOCX, TXT'
            }), 400
        
        # Reset file pointers
        resume_file.seek(0)
        jd_file.seek(0)
        
        # Parse files
        try:
            resume_data = resume_parser.parse_resume(resume_file)
            jd_data = resume_parser.parse_job_description(jd_file)
        except ParserException as e:
            return jsonify({'error': str(e)}), 400
        
        # Calculate match scores
        match_result = matching_engine.calculate_match_score(resume_data, jd_data)
        
        # Determine message based on score
        overall_score = match_result['overall_score']
        if overall_score >= 80:
            message = "Excellent match! This candidate meets most of the job requirements."
        elif overall_score >= 60:
            message = "Good match! This candidate has several relevant qualifications."
        elif overall_score >= 40:
            message = "Fair match! This candidate has some relevant experience but may need additional training."
        elif overall_score >= 20:
            message = "Limited match! This candidate has minimal relevant qualifications."
        else:
            message = "Poor match! This candidate does not meet most of the job requirements."
        
        # Format response
        response = {
            'overall_match_percentage': overall_score,
            'breakdown': {
                'skills_score': match_result['breakdown'].skills_score,
                'experience_score': match_result['breakdown'].experience_score,
                'education_score': match_result['breakdown'].education_score,
                'semantic_score': match_result['breakdown'].semantic_score
            },
            'explanations': match_result.get('explanations', []),
            'message': message
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        print(f"Error in screen_resume: {e}")
        return jsonify({
            'error': 'An error occurred while processing the request',
            'details': str(e)
        }), 500


@app.route('/test/screen_resume', methods=['POST'])
def test_screen_resume():
    """
    Test endpoint for screening without authentication (for development/testing only)
    
    Expected form data:
    - resume_file: Resume file (PDF, DOCX, or TXT)
    - jd_file: Job description file (PDF, DOCX, or TXT)
    """
    try:
        # Check if files are present
        if 'resume_file' not in request.files:
            return jsonify({'error': 'resume_file is required'}), 400
        
        if 'jd_file' not in request.files:
            return jsonify({'error': 'jd_file is required'}), 400
        
        resume_file = request.files['resume_file']
        jd_file = request.files['jd_file']
        
        # Check if files are empty
        if resume_file.filename == '' or jd_file.filename == '':
            return jsonify({'error': 'Files must not be empty'}), 400
        
        # Check file extensions
        if not (allowed_file(resume_file.filename) and allowed_file(jd_file.filename)):
            return jsonify({
                'error': 'Invalid file type. Allowed types: PDF, DOCX, TXT'
            }), 400
        
        # Reset file pointers
        resume_file.seek(0)
        jd_file.seek(0)
        
        # Parse files
        try:
            resume_data = resume_parser.parse_resume(resume_file)
            jd_data = resume_parser.parse_job_description(jd_file)
        except ParserException as e:
            return jsonify({'error': str(e)}), 400
        
        # Calculate match scores
        match_result = matching_engine.calculate_match_score(resume_data, jd_data)
        
        # Determine message based on score
        overall_score = match_result['overall_score']
        if overall_score >= 80:
            message = "Excellent match! This candidate meets most of the job requirements."
        elif overall_score >= 60:
            message = "Good match! This candidate has several relevant qualifications."
        elif overall_score >= 40:
            message = "Fair match! This candidate has some relevant experience but may need additional training."
        else:
            message = "Limited match. This candidate may not be a suitable fit for this role."
        
        # Convert breakdown object to dict
        breakdown_obj = match_result['breakdown']
        breakdown_dict = {
            'skills_score': breakdown_obj.skills_score,
            'experience_score': breakdown_obj.experience_score,
            'education_score': breakdown_obj.education_score,
            'semantic_score': breakdown_obj.semantic_score
        }
        
        # Construct response
        response_data = {
            'overall_match_percentage': overall_score,
            'breakdown': breakdown_dict,
            'explanations': match_result.get('explanations', []),
            'message': message
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Error in test_screen_resume: {e}")
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
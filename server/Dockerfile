# Use Python 3.11-slim (slightly newer/better wheel support than 3.10)
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# 1. Install system build dependencies and libraries
# - build-essential: contains gcc/make for compiling python packages
# - libmagic1: required by python-magic
# - libffi-dev, libssl-dev: required by python-jose[cryptography]
# - curl: for testing/healthchecks
RUN apt-get update && apt-get install -y \
    build-essential \
    libmagic1 \
    libffi-dev \
    libssl-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 2. Copy requirements first to leverage Docker cache
COPY requirements.txt .

# 3. Install dependencies with CPU-only PyTorch preference
# We use --extra-index-url to find the CPU versions of torch, 
# preventing the massive GPU version from being installed.
RUN pip install --no-cache-dir -U pip && \
    pip install --no-cache-dir -r requirements.txt \
    --extra-index-url https://download.pytorch.org/whl/cpu

# 4. Pre-download the spaCy model (en_core_web_sm)
# This prevents it from failing at runtime or needing 1GB+ RAM to download on boot
RUN python -m spacy download en_core_web_sm

# 5. Pre-download the Sentence Transformer model
# This ensures the model is baked into the image
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('intfloat/e5-base-v2')"

# 6. Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["python", "main.py"]
#!/usr/bin/env python3
"""
Test script to verify the improved e5-base-v2 scoring model
"""

from matching_engine import score_resume_vs_jd, jd_to_bullets, sentencize
from resume_parser import ResumeParser

# Test sample data
sample_jd = """
Senior Python Developer

Responsibilities:
- Design and implement scalable microservices using Python and FastAPI
- Develop RESTful APIs for internal and external consumption
- Lead code reviews and mentor junior team members
- Implement CI/CD pipelines using Docker and Kubernetes
- Optimize database queries and improve application performance
- Collaborate with product teams to define technical requirements
- Participate in on-call rotation for production support

Requirements:
- 5+ years of professional Python development experience
- Strong knowledge of Docker, Kubernetes, and cloud infrastructure (AWS/Azure preferred)
- Experience with microservices architecture and distributed systems
- Proficiency in FastAPI, Django, or similar modern Python frameworks
- Strong SQL and database design knowledge
- Experience with CI/CD tools and DevOps practices
- Excellent communication and team collaboration skills
- Bachelor's degree in Computer Science or related field

Preferred:
- Experience with machine learning frameworks
- Open source contributions
- Experience with Kubernetes at scale
"""

sample_resume = """
John Doe
john@example.com | (555) 123-4567

Professional Summary:
Experienced Full-Stack Developer with 6 years of professional experience building scalable web applications.
Strong expertise in Python, JavaScript, and cloud technologies. Proven track record of leading engineering teams
and delivering high-impact projects.

Technical Skills:
Python, FastAPI, Django, Node.js, React, Docker, Kubernetes, AWS, PostgreSQL, MongoDB, Redis,
Git, Jenkins, Terraform, Machine Learning, TensorFlow, Scikit-learn

Professional Experience:

Senior Developer at Tech Company
June 2021 - Present
- Architected and developed microservices using Python and FastAPI, handling 100K+ requests/day
- Led a team of 4 developers in building cloud-native applications on AWS
- Implemented comprehensive CI/CD pipeline using Docker, Jenkins, and Kubernetes
- Optimized database queries reducing latency by 40%
- Mentored 3 junior developers in Python best practices and system design
- Managed on-call rotation ensuring 99.9% uptime for production services

Software Developer at StartUp Inc.
January 2019 - May 2021
- Developed RESTful APIs using Django and FastAPI
- Implemented containerized microservices with Docker
- Worked with PostgreSQL and MongoDB databases
- Contributed to open source Django projects

Junior Developer at Web Services Corp.
June 2017 - December 2018
- Built web applications using Python Django framework
- Wrote unit tests and integration tests
- Participated in code reviews

Education:
B.S. in Computer Science, State University, May 2017
"""

print("=" * 80)
print("IMPROVED RESUME SCREENING TEST")
print("=" * 80)

# Test 1: Extract JD bullets
print("\n1. EXTRACTING JD BULLETS:")
print("-" * 80)
bullets = jd_to_bullets(sample_jd)
print(f"Found {len(bullets)} JD bullets:")
for i, bullet in enumerate(bullets[:5], 1):
    print(f"  {i}. {bullet[:70]}...")

# Test 2: Extract resume sentences
print("\n2. EXTRACTING RESUME SENTENCES:")
print("-" * 80)
sentences = sentencize(sample_resume)
print(f"Found {len(sentences)} resume sentences")
print(f"First few: {sentences[:3]}")

# Test 3: Score resume vs JD
print("\n3. CALCULATING MATCH SCORE:")
print("-" * 80)
result = score_resume_vs_jd(sample_jd, sample_resume)

print(f"\nFinal Score: {result.final_score} / 100")
print(f"\nSubscores:")
for key, value in result.subscores.items():
    print(f"  {key}: {value}")

print(f"\nTop 3 Evidence (JD bullet → Resume sentence):")
for i, exp in enumerate(result.responsibility_alignment[:3], 1):
    print(f"\n  {i}. JD Bullet:")
    print(f"     {exp['jd_bullet'][:70]}...")
    print(f"     Resume Match:")
    print(f"     {exp['resume_sentence'][:70]}...")
    print(f"     Similarity: {exp['similarity']:.3f}")

print("\n" + "=" * 80)
print("TEST COMPLETED SUCCESSFULLY!")
print("=" * 80)

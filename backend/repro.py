import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load .env from the backend directory
load_dotenv(".env")
api_key = os.getenv('GEMINI_API_KEY')
print(f"API Key found: {api_key[:5]}..." if api_key else "API Key NOT found")

if not api_key:
    exit(1)

genai.configure(api_key=api_key)
try:
    print("Initializing model gemini-1.5-pro...")
    model = genai.GenerativeModel('gemini-1.5-pro')
    print("Generating content...")
    response = model.generate_content('Hi')
    print(f"Response: {response.text}")
    print('SUCCESS')
except Exception as e:
    print(f'ERROR: {e}')

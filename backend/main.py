from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os, openai
from dotenv import load_dotenv  # add this line

# Load environment variables from .env
load_dotenv()  # this loads OPENAI_API_KEY from backend/.env

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Use the API key from environment
openai.api_key = os.environ.get("OPENAI_API_KEY")

@app.post("/compare")
async def compare_devices(request: Request):
    data = await request.json()
    devices = data.get("devices", [])
    if not devices:
        return {"error": "No devices provided"}

    prompt = f"Compare these devices: {', '.join(devices)}. Generate pros, cons, specs, and a side-by-side table in JSON format."

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role":"user", "content": prompt}],
            temperature=0.7
        )
        text = response.choices[0].message.content
        return {"comparison": text}
    except Exception as e:
        return {"error": str(e)}

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os, openai
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.environ.get("OPENAI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/compare")
async def compare_devices(request: Request):
    data = await request.json()
    devices = data.get("devices", [])
    if not devices:
        return {"error": "No devices provided"}

    prompt = f"Compare these devices: {', '.join(devices)}. Generate pros, cons, specs, and a side-by-side table in HTML format."
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

# NEW: AI-powered suggestions
@app.post("/suggest")
async def suggest_devices(request: Request):
    data = await request.json()
    query = data.get("query", "").strip()
    if not query:
        return {"suggestions": []}

    prompt = f"Give 5 popular device models starting with '{query}' in JSON array format, just names."
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role":"user","content":prompt}],
            temperature=0.7
        )
        text = response.choices[0].message.content
        # Try to parse JSON from AI response
        import json
        suggestions = json.loads(text)
        return {"suggestions": suggestions}
    except Exception as e:
        return {"suggestions": [], "error": str(e)}

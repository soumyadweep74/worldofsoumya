import requests
from bs4 import BeautifulSoup

# Placeholder data (replace with real scraping/API later)
SAMPLE_DATA = {
    "Phone": [
        {"name":"Redmi Note 12","battery":"5000 mAh","camera":"64MP","processor":"SD 695","price":15000,"pros":["Good battery","Fast charging"],"cons":["Average camera"]},
        {"name":"iPhone 14","battery":"3279 mAh","camera":"12MP","processor":"A15 Bionic","price":70000,"pros":["Excellent performance","Good camera"],"cons":["Expensive"]}
    ],
    "Laptop": [
        {"name":"Dell Inspiron 15","CPU":"Intel i5","GPU":"Integrated","battery":"6 hours","price":55000,"pros":["Lightweight","Good build"],"cons":["No dedicated GPU"]},
        {"name":"MacBook Air M2","CPU":"M2","GPU":"Integrated","battery":"15 hours","price":120000,"pros":["Excellent battery","Retina display"],"cons":["Expensive"]}
    ]
}

def search_device(category, query):
    """
    Return list of matching device names
    """
    devices = SAMPLE_DATA.get(category, [])
    query = query.lower()
    return [d['name'] for d in devices if query in d['name'].lower()]

def get_device_info(category, query):
    """
    Return full device info. Placeholder: replace with dynamic scraping/API
    """
    devices = SAMPLE_DATA.get(category, [])
    for d in devices:
        if d['name'].lower() == query.lower():
            return d
    # If not found, could fetch from API/web
    return {"name": query, "pros":[],"cons":[]}

def generate_verdict(devices_info):
    """
    Generate AI-style verdict. Placeholder logic
    """
    verdict = "🚀 AI Verdict:\n"
    for d in devices_info:
        verdict += f"{d['name']} is good for {', '.join(d.get('pros',[]))}\n"
    verdict += "💡 Recommendation: Choose based on your main usage and budget."
    return verdict

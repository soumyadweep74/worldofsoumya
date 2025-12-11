from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import utils

app = FastAPI(title="Smart Device Comparison API")

# Allow your frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Device selection request model
class DeviceSelection(BaseModel):
    category: str
    query: str

# Multi-device comparison request
class CompareRequest(BaseModel):
    devices: List[DeviceSelection]

@app.get("/")
def root():
    return {"message": "Smart Device Comparison API is running"}

@app.post("/search")
def search_device(selection: DeviceSelection):
    """
    Returns search suggestions for the given category and query
    """
    results = utils.search_device(selection.category, selection.query)
    return {"suggestions": results}

@app.post("/compare")
def compare_devices(req: CompareRequest):
    """
    Returns AI-style comparison results for selected devices
    """
    devices_info = []
    for d in req.devices:
        info = utils.get_device_info(d.category, d.query)
        devices_info.append(info)
    
    verdict = utils.generate_verdict(devices_info)
    return {
        "devices": devices_info,
        "verdict": verdict
    }

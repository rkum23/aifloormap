from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import List, Optional
from PIL import Image, ImageDraw, ImageFont
import io
import requests

HUGGINGFACE_API_TOKEN = "YOUR_HF_API_TOKEN"  # <-- Replace with your Hugging Face API token

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Room(BaseModel):
    name: str
    x: int
    y: int
    width: int
    height: int

class Door(BaseModel):
    x: int
    y: int
    width: int = 10
    height: int = 3
    orientation: str = Field("horizontal", description="horizontal or vertical")

class Window(BaseModel):
    x: int
    y: int
    width: int = 10
    height: int = 3
    orientation: str = Field("horizontal", description="horizontal or vertical")

class FloorPlanRequest(BaseModel):
    rooms: List[Room]
    doors: Optional[List[Door]] = []
    windows: Optional[List[Window]] = []

@app.post("/generate-floorplan/")
def generate_floorplan(data: FloorPlanRequest):
    # Compose a prompt from user input
    prompt = "A floor plan with " + ", ".join([f"{room.name} ({room.width}x{room.height})" for room in data.rooms])
    if data.doors:
        prompt += f", {len(data.doors)} doors"
    if data.windows:
        prompt += f", {len(data.windows)} windows"

    response = requests.post(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
        headers={"Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}"},
        json={"inputs": prompt}
    )
    image_bytes = response.content
    return StreamingResponse(io.BytesIO(image_bytes), media_type="image/png") 
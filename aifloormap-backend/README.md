# AIFloorMap Backend

## Setup

1. Create and activate virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn pillow
   ```

## Run the API server

```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

## Endpoint
- `POST /generate-floorplan/` — Accepts JSON `{ "length": float, "width": float }` and returns a PNG image of the floor plan. 
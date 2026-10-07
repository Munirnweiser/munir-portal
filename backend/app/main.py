"""Munir Portal backend stub (FastAPI).

Serves the visitor-counter API used by frontend/counter.js.
Run locally with:  uvicorn app.main:app --reload
"""

from fastapi import FastAPI

app = FastAPI(title="Munir Portal API")

_visits = {"count": 0}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/visits")
def record_visit():
    """Record one visit and return the running total."""
    _visits["count"] += 1
    return {"visits": _visits["count"]}


@app.get("/api/visits")
def get_visits():
    """Return the current visit total without incrementing."""
    return {"visits": _visits["count"]}

# app/api/routes/hello.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/hello")
def read_hello():
    return {"message": "Hello, World"}

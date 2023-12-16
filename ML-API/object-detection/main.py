from fastapi import FastAPI
from app.routes.object_detection_routes import router as object_routes

app = FastAPI()

app.include_router(object_routes)

@app.get("/main")
async def helloWorld():
    return {
        "message": "Welcome to EatWise Recipe Ingredients Detection API"
    }

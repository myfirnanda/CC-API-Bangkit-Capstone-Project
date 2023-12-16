from fastapi import FastAPI
from app.routes.recipe_routes import router as recipe_router

app = FastAPI()

app.include_router(recipe_router)

@app.get("/main")
async def helloWorld():
    return {
        "message": "Welcome to EatWise Recipe Recommendation API"
    }

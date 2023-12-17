from fastapi import FastAPI 
from app.routes.calculate_serat_routes import router as calculate_serat_routes

app = FastAPI()

app.include_router(calculate_serat_routes)

@app.get("/main")
async def helloWorld():
    return {"message": "Welcome to EatWise Calculate Serat API"}
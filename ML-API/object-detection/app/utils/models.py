from pydantic import BaseModel
from typing import Dict, List

class Recipe(BaseModel):
    id: int
    title: str
    ingredients: str
    preparation: str
    
class Ingredients(BaseModel):
    ingredients: Dict[str, float]
    recommendations: List[Recipe]
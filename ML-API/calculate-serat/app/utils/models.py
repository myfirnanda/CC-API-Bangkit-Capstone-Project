from pydantic import BaseModel

class UserInfo(BaseModel):
    gender: str
    age: int
    weight: float
    height: float
    activity_level: str
    
class CalculateSerat(BaseModel):
    total_calories: float
    grams_protein: float
    grams_fat: float
    grams_carbs: float
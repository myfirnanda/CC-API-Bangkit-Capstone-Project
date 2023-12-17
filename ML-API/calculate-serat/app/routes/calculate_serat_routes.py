from fastapi import APIRouter, HTTPException

from ..utils.models import UserInfo, CalculateSerat
from ..utils.data_utils import calculate_bmr, calculate_nutrition

router = APIRouter()

@router.post("/calculate_daily_caloric_needs", response_model=CalculateSerat)
async def calculate_daily_caloric_needs(userInfo: UserInfo) -> CalculateSerat:
    """Calculates the daily caloric needs of a user.

    Args:
        userInfo: The user's information, including gender, weight, height, age, and activity level.

    Returns:
        A CalculateSerat object containing the user's total caloric needs, as well as their daily intake of carbohydrates, protein, and fat.

    Raises:
        HTTPException: If the user's activity level is invalid.
        ValueError: If the user's weight, height, or age is invalid.
    """
    
    ACTIVITY_FACTORS = {
        'sedentary': 1.2,
        'lightly active': 1.375,
        'moderately active': 1.55,
        'active': 1.725,
        'highly active': 1.9
    }
    
    activity_factor = ACTIVITY_FACTORS.get(userInfo.activity_level.lower())
    if not activity_factor:
        raise HTTPException(status_code=400, detail="Invalid activity level.")

    try:
        bmr = calculate_bmr(userInfo.gender, userInfo.weight, userInfo.height, userInfo.age)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    total_calories = bmr * activity_factor
    nutrition = calculate_nutrition(total_calories)

    return CalculateSerat(total_calories=total_calories, **nutrition)
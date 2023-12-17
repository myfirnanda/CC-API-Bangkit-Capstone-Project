from typing import Dict

def calculate_bmr(gender: str, weight: float, height: float, age: int) -> float:
    MALE_BMR_CONSTANTS = (66, 13.7, 5, 6.8)
    FEMALE_BMR_CONSTANTS = (655, 9.6, 1.8, 4.7)

    if gender.lower() == 'male':
        return MALE_BMR_CONSTANTS[0] + (MALE_BMR_CONSTANTS[1] * weight) + (MALE_BMR_CONSTANTS[2] * height) - (MALE_BMR_CONSTANTS[3] * age)
    elif gender.lower() == 'female':
        return FEMALE_BMR_CONSTANTS[0] + (FEMALE_BMR_CONSTANTS[1] * weight) + (FEMALE_BMR_CONSTANTS[2] * height) - (FEMALE_BMR_CONSTANTS[3] * age)
    else:
        raise ValueError("Invalid gender. Must be 'male' or 'female'.")

def calculate_nutrition(total_calories: float) -> Dict[str, float]:
    PERCENTAGE_PROTEIN = 0.14
    PERCENTAGE_FAT = 0.34
    PERCENTAGE_CARBS = 0.55

    return {
        "grams_protein": total_calories * PERCENTAGE_PROTEIN / 4,
        "grams_fat": total_calories * PERCENTAGE_FAT / 9,
        "grams_carbs": total_calories * PERCENTAGE_CARBS / 4
    }
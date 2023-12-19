from fastapi import APIRouter, Depends, HTTPException

from ..utils.models import UserInput, Recipe, RecipeModelData
from ..utils.data_utils import (
    generate_user_input_vector, 
    recommend_top_recipes,
    get_recipe_data
)

router = APIRouter()

# load token, model, csv data into a memory
recipe_model_data_instance = RecipeModelData()

# invoke loaded dependencies
def get_recipe_data():
    return recipe_model_data_instance

@router.post("/recommend-recipes/predict/", response_model=list[Recipe])
async def recommend_recipes(user_input: UserInput, data: RecipeModelData = Depends(get_recipe_data)):
    
    if not (user_input.limit == "all" or (isinstance(user_input.limit, int) and user_input.limit >= 1)):
        raise HTTPException(status_code=400, detail="Invalid limit value")

    
    user_input_vector = generate_user_input_vector(data.w2v_model, user_input.ingredients)
    top_recipes_titles = recommend_top_recipes(user_input_vector, data.all_recipes_vector, data.data)
    
    result_df = data.data[data.data['title'].isin(top_recipes_titles)].reset_index(drop=True)
    
    results_list = []
    for _, row in result_df.iterrows():
        result = {
            "title": row["title"],
            "slugs": "-".join([i.lower() for i in row["title"].split()]),
            "ingredients": row["ingredients"],
            "preparation": row["preparation"],
            "calories": row["calories"],
            "carb": row["carb"],
            "protein": row["protein"],
            "fat": row["fat"],
            "types": row["types"],
            "category": row["category"],
            "isdairy": row["is_diary"],
            "img": row["image_url"],
        }
        results_list.append(result)

    if user_input.limit is None or user_input.limit == "all":
        return results_list
    
    return results_list[:int(user_input.limit)]

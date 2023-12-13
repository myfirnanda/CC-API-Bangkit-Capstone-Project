from fastapi import APIRouter, Depends

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
    user_input_vector = generate_user_input_vector(data.w2v_model, user_input.ingredients)
    top_recipes_titles = recommend_top_recipes(user_input_vector, data.all_recipes_vector, data.data)
    
    result_df = data.data[data.data['title'].isin(top_recipes_titles)].reset_index(drop=True)
    
    print(result_df)

    results_list = []
    for _, row in result_df.iterrows():
        print(row)
        result = {
            "id": row["id"],
            "title": row["title"],
            "ingredients": row["ingredients"],
            "preparation": row["preparation"]
        }
        results_list.append(result)

    if user_input.limit is None or user_input.limit == "all":
        return results_list
    
    return results_list[:int(user_input.limit)]

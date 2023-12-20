from pydantic import BaseModel
from typing import Union
from .data_utils import (
    load_tokens, load_word2vec_model,
    get_recipe_data, calculate_recipe_vectors
)

class UserInput(BaseModel):
    ingredients: str
    limit: Union[int, str] = None
    
class Recipe(BaseModel):
    title: str
    slugs: str
    ingredients: str
    preparation: str
    calories: str
    carb: str
    fat: str
    types: str
    category: str
    isdairy: int
    img: str

class RecipeModelData:
    def __init__(self) -> None:
        self.all_tokens = load_tokens("app/ml/tokens.pkl")
        self.w2v_model = load_word2vec_model("app/ml/word2vec_model.bin")
        self.data = get_recipe_data("app/ml/data_vegan.csv")
        self.all_recipes_vector = calculate_recipe_vectors(self.w2v_model, self.all_tokens)
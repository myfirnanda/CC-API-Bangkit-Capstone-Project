import numpy as np
import pandas as pd
import nltk
nltk.download("punkt")
import gensim
from nltk.tokenize import word_tokenize
import pickle
from sklearn.metrics.pairwise import cosine_similarity

def load_tokens(tokens_filename):
    with open(tokens_filename, 'rb') as file:
        return pickle.load(file)
    
def load_word2vec_model(filename):
    return gensim.models.Word2Vec.load(filename)

def generate_user_input_vector(model, user_input):
    user_input_tokens = word_tokenize(user_input)
    user_input_vector = [0] * model.vector_size
    num_tokens = 0

    for token in user_input_tokens:
        if token in model.wv:
            user_input_vector = [a + b for a, b in zip(user_input_vector, model.wv[token])]
            num_tokens += 1

    if num_tokens > 0:
        user_input_vector = [x / num_tokens for x in user_input_vector]

    return np.array(user_input_vector).reshape(1, -1)

def calculate_recipe_vectors(model, recipes_tokens):
    all_recipes_vector = []
    for recipe_tokens in recipes_tokens:
        recipe_vector = [0] * model.vector_size
        num_tokens = 0

        for token in recipe_tokens:
            if token in model.wv:
                recipe_vector = [a + b for a, b in zip(recipe_vector, model.wv[token])]
                num_tokens += 1

        if num_tokens > 0:
            recipe_vector = [x / num_tokens for x in recipe_vector]

        all_recipes_vector.append(recipe_vector)

    return np.array(all_recipes_vector)

def recommend_top_recipes(user_input_vector, all_recipes_vector, data, N=20):
    similarities = cosine_similarity(user_input_vector, all_recipes_vector)
    top_indices = similarities.argsort()[0][-N:][::-1]
    top_recipes_titles = [data['title'][idx] for idx in top_indices]
    return top_recipes_titles

def get_recipe_data(file_csv):
    data = pd.read_csv(file_csv)
    data['title'] = data['title'].apply(lambda x: x.title())
    return data

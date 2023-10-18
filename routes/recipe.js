const {Router} = require('express');

const router = Router();

const {
  getRecipe,
  getRecipes,
} = require('../controllers/recipe');

router.get('/recipes', getRecipes);
router.get('/recipes/:recipeSlug', getRecipe);

module.exports = router;

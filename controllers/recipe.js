const Recipe = require('../models/Recipe');

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.status(200).json({
      success: true,
      message: 'Berhasil',
      data: recipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal',
    });
  };
};

exports.getRecipe = async (req, res) => {
  try {
    const slug = req.params.recipeSlug;
    const recipe = await Recipe.findOne({where: {slug}});

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Resep tidak ditemukan',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Berhasil cuy',
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({success: false, message: 'Gagal'});
  }
};

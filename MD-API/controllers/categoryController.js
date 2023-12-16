const slugify = require('slugify');

const Category = require('../models/categoryModel');
const Recipe = require('../models/recipeModel');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    return res.status(200).json({
      success: true,
      message: 'Successful Get All Categories',
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const {categorySlug} = req.params;

    const category = await Recipe.findOne({
      where: {slug: categorySlug},
    });

    if (!category) {
      return res.json(404).json({
        success: false,
        message: 'Category Not Found!',
      });
    }

    const recipes = await Recipes.findAll({
      where: {category_id: category.id},
    });

    return res.status(200).json({
      success: true,
      message: 'Successful Get Category Detail',
      dataCategory: category,
      dataRecipes: recipes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getAddCategory = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Successful Get Add Category',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.postAddCategory = async (req, res) => {
  try {
    const {name} = req.body;

    const existingCategory = await Category.findOne({
      where: {name},
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category Already Exist!',
      });
    }

    const slug = slugify(name, {lower: true});

    await Category.create({
      name,
      slug,
    });

    return res.status(201).json({
      success: true,
      message: 'Successful Add New Category',
      data: {
        name,
        slug,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getEditCategory = async (req, res) => {
  try {
    const {categorySlug} = req.params;

    const category = await Category.findOne({
      where: {slug: categorySlug},
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category Not Found!',
      });
    }

    if (category.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successful Get Edit Category',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.patchEditCategory = async (req, res) => {
  try {
    const {categorySlug} = req.params;

    const category = await Category.findOne({
      where: {slug: categorySlug},
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category Not Found!',
      });
    }

    if (category.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    const {name} = req.body;

    const existingCategory = await Category.findOne({
      where: {name},
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category Already Exist!',
      });
    }

    await Category.create({
      name,
      slug,
    });

    const slug = slugify(name, {lower: true});

    await category.update({
      name,
      slug,
    });

    return res.status(200).json({
      success: true,
      message: 'Successful Update Category',
      data: {
        name,
        slug,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const {categorySlug} = req.params;

    const category = await Category.findOne({
      where: {slug: categorySlug},
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category Not Found',
      });
    }

    if (category.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    await category.destroy();

    return res.status(200).json({
      success: true,
      message: 'Successful Delete Category',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

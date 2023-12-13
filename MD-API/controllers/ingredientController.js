const fs = require('fs');
const slugify = require('slugify');

const Ingredient = require('../models/ingredientModel');
const Recipe = require('../models/recipeModel');

exports.getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.findAll({
      include: {
        model: Recipe,
        as: 'recipes',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Successful Get All Ingredients',
      data: ingredients,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getIngredient = async (req, res) => {
  try {
    const {ingredientSlug} = req.params;

    const ingredient = await Ingredient.findOne({
      where: {slug: ingredientSlug},
      include: {
        model: Recipe,
        as: 'recipes',
      },
    });

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: 'Ingredient Not Found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successful Get Ingredient',
      data: ingredient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getAddIngredient = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Successful Get Add Ingredient',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.postAddIngredient = async (req, res) => {
  try {
    const imageName = req.file;

    if (!imageName) {
      return res.status(400).json({
        success: false,
        message: 'Image is Required to Add New Ingredient',
      });
    }

    const {
      name,
      isVegan,
      isMandatory,
    } = req.body;

    const slug = slugify(name, {lower: true});

    await Ingredient.create({
      image_name: imageName.filename,
      name,
      slug,
      isVegan,
      isMandatory,
    });

    return res.status(201).json({
      success: true,
      message: 'Successful Add New Ingredient',
      data: req.body,
      file: req.file,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getEditIngredient = async (req, res) => {
  try {
    const {ingredientSlug} = req.params;

    const ingredient = await Ingredient.findOne({
      where: {slug: ingredientSlug},
    });

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: 'Ingredient Not Found!',
      });
    }

    if (ingredient.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successful Get Edit Ingredient',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.patchEditIngredient = async (req, res) => {
  try {
    const {ingredientSlug} = req.params;

    const ingredient = await Ingredient.findOne({
      where: {slug: ingredientSlug},
    });

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: 'Ingredient Not Found',
      });
    }

    if (ingredient.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    const imageName = req.file;

    const oldImage = ingredient.image_name;
    const newImage = imageName ? imageName.filename : oldImage;

    if (imageName) {
      fs.unlink(`./storage/images/ingredients/${oldImage}`, (err) => {
        if (err) throw err;
        console.log(`${oldImage} was deleted`);
      });
    }

    const {
      name,
      isVegan,
      isMandatory,
    } = req.body;

    const slug = slugify(name, {lower: true});

    await ingredient.update({
      image_name: newImage,
      name,
      slug,
      isVegan,
      isMandatory,
    }, {
      where: {user_id: req.user_id},
    });

    return res.status(200).json({
      success: true,
      message: 'Successful Update Ingredient',
      data: req.body,
      file: req.file,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.deleteIngredient = async (req, res) => {
  try {
    const {ingredientSlug} = req.params;

    const ingredient = await Ingredient.findOne({
      where: {slug: ingredientSlug},
    });

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: 'Ingredient Not Found!',
      });
    }

    if (ingredient.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    const imageName = ingredient.image_name;

    if (imageName) {
      const storagePath = `./storage/images/ingredients/${imageName}`;
      fs.unlink(storagePath, (err) => {
        if (err) throw err;
        console.log(`${imageName} was deleted`);
      });
    }

    await ingredient.destroy();

    return res.status(200).json({
      success: true,
      message: 'Successful Delete Ingredient',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

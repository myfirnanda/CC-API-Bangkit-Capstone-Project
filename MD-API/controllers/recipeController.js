const fs = require('fs');
const slugify = require('slugify');
const {Op} = require('sequelize');
const {Storage} = require('@google-cloud/storage');

const Category = require('../models/categoryModel');
const Recipe = require('../models/recipeModel');
const NutritionFact = require('../models/nutritionFactModel');
const RecipeIngredient = require('../models/recipeIngredientsModel');
const Bookmark = require('../models/bookmarkModel');
const Activity = require('../models/activityModel');
const Ingredient = require('../models/ingredientModel');
const Type = require('../models/typeModel');
const Goal = require('../models/goalModel');

exports.getRecipes = async (req, res) => {
  try {
    const {search} = req.query;

    const whereCondition = {
      name: {
        [Op.like]: `%${search}%`,
      },
    };

    if (req.user.isDairy == false) {
      whereCondition.isDairy = req.user.isDairy;
    }

    const recipes = await Recipe.findAll({
      where: whereCondition,
    });

    return res.status(200).json({
      success: true,
      message: 'Successful Get All Recipes',
      data: recipes,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const {recipeSlug} = req.params;

    const recipe = await Recipe.findOne({
      where: {slug: recipeSlug},
      include: [Category, Type, NutritionFact, Ingredient],
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe Not Found!',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successful Get Recipe Detail',
      data: recipe,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};


exports.getAddRecipe = async (req, res) => {
  try {
    const categories = await Category.findAll();
    const types = await Type.findAll();
    const ingredients = await Ingredient.findAll();
    const nutritionFacts = await NutritionFact.findAll();

    return res.status(200).json({
      success: true,
      message: 'Successful Get Add Recipe',
      data: {
        categories,
        types,
        ingredients,
        nutritionFacts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  };
};

exports.postAddRecipe = async (req, res) => {
  try {
    const imageName = req.file;

    const storageBucket = 'eatwise-storage-bucket';
    const storageClient = new Storage({
      projectId: 'capstone-api-406515',
      keyFilename: 'eatwise-api-key.json',
    });
    const bucket = storageClient.bucket(storageBucket);

    const fileName = `${Date.now()}-${slugify(imageName.originalname,
        {lower: true},
    )}`;

    const gcsFile = bucket.file(fileName);
    const stream = gcsFile.createWriteStream({
      metadata: {
        contentType: imageName.mimetype,
      },
    });

    stream.on('finish', () => {
      res.status(200);
    });

    stream.on('error', () => {
      res.status(500);
    });

    const {
      name,
      description,
      preparation,
      isDairy,
      type_id,
      category_id,
      calorie_dose,
      carbo_dose,
      protein_dose,
      fat_dose,
      ingredients,
    } = req.body;

    const slug = slugify(name, {lower: true});

    const recipe = await Recipe.create({
      image_name: fileName,
      name,
      description,
      preparation,
      isDairy,
      slug,
      user_id: req.user.id,
      type_id,
      category_id,
    });

    await NutritionFact.create({
      calorie_dose,
      carbo_dose,
      protein_dose,
      fat_dose,
      recipe_id: recipe.id,
    });

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ingredients. An array of ingredients is required.',
      });
    }

    if (ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ingredients. Array of ingredients cannot be empty.',
      });
    }

    const parsedData = JSON.parse(ingredients);

    const recipeIngredientsData = parsedData.map(({
      dose,
      unit,
      ingredient_id,
    }) => ({
      dose,
      unit,
      recipe_id: recipe.id,
      ingredient_id,
    }));

    const recipeIngredients = await RecipeIngredient
        .bulkCreate(recipeIngredientsData);

    stream.end(imageName.buffer);

    return res.status(201).json({
      success: true,
      message: 'Successful Add New Recipe',
      dataRecipe: {
        name,
        slug,
        description,
        preparation,
        isDairy,
        user_id: req.user.id,
        type_id,
        category_id,
      },
      dataNutritionFact: {
        calorie_dose,
        carbo_dose,
        protein_dose,
        fat_dose,
      },
      dataRecipeIngredient: recipeIngredients.map(({
        dose,
        unit,
        ingredient_id,
      }) => ({
        dose,
        unit,
        ingredient_id,
      })),
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

exports.getEditRecipe = async (req, res) => {
  try {
    const {recipeSlug} = req.params;

    const recipe = await Recipe.findOne({
      where: {slug: recipeSlug},
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe Not Found!',
      });
    }

    if (recipe.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    const categories = await Category.findAll();
    const types = await Type.findAll();
    const ingredients = await Ingredient.findAll();
    const nutritionFacts = await NutritionFact.findAll();

    return res.status(200).json({
      success: true,
      message: 'Successful Get Edit Recipe',
      data: {
        categories,
        types,
        ingredients,
        nutritionFacts,
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

exports.patchEditRecipe = async (req, res) => {
  try {
    const recipeSlug = req.params.recipeSlug;

    const recipe = await Recipe.findOne({
      where: {slug: recipeSlug},
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe Not Found!',
      });
    }

    if (recipe.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    const imageName = req.file;

    const oldImage = ingredient.image_name;
    const newImage = imageName ? imageName.filename : oldImage;

    if (imageName) {
      fs.unlink(`./storage/images/recipes/${oldImage}`, (err) => {
        if (err) throw err;
        console.log(`${oldImage} was deleted`);
      });
    }

    const {
      name,
      description,
      preparation,
      type_id,
      category_id,
      calorie_dose,
      carbo_dose,
      protein_dose,
      fat_dose,
      ingredients,
    } = req.body;

    const slug = slugify(name, {lower: true});

    const updatedRecipe = await recipe.update({
      image_name: newImage,
      name,
      slug,
      description,
      preparation,
      user_id,
      type_id,
      category_id,
    }, {
      where: {user_id: req.user.id},
    });

    await NutritionFact.update({
      calorie_dose,
      carbo_dose,
      protein_dose,
      fat_dose,
    }, {
      where: {recipe_id: updatedRecipe.id},
    });

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ingredients. An array of ingredients is required.',
      });
    }

    if (ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ingredients. Array of ingredients cannot be empty.',
      });
    }

    const parsedData = JSON.parse(ingredients);

    const recipeIngredientsData = parsedData.map(({
      dose,
      unit,
      ingredient_id,
    }) => ({
      dose,
      unit,
      recipe_id: recipe.id,
      ingredient_id,
    }));

    const recipeIngredients = await RecipeIngredient
        .update(recipeIngredientsData, {
          where: {recipe_id: updatedRecipe.id},
        });

    return res.status(200).json({
      success: true,
      message: 'Successful Update Recipe',
      dataRecipe: {
        name,
        slug,
        description,
        preparation,
        user_id: req.user.id,
        type_id,
        category_id,
      },
      dataNutritionFact: {
        calorie_dose,
        carbo_dose,
        protein_dose,
        fat_dose,
      },
      dataRecipeIngredient: recipeIngredients.map(({
        dose,
        unit,
        ingredient_id,
      }) => ({
        dose,
        unit,
        ingredient_id,
      })),
      file: {
        publicUrl: `https://storage.googleapis.com/${storageBucket}/${fileName}`,
        images: req.file,
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

exports.deleteRecipe = async (req, res) => {
  try {
    const {recipeSlug} = req.params;

    const recipe = await Recipe.findOne({
      where: {slug: recipeSlug},
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe Not Found',
      });
    }

    if (recipe.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    const imageName = recipe.image_name;

    if (imageName) {
      const storage = new Storage({
        projectId: 'capstone-api-406515',
        keyFilename: 'eatwise-api-key.json',
      });

      const storageBucket = 'eatwise-storage-bucket';
      const fileName = imageName;

      const bucket = storage.bucket(storageBucket);
      const file = bucket.file(fileName);
      // const imagePath = `./image/images/recipes/${imageName}`;
      // fs.unlink(imagePath, (err) => {
      //   if (err) throw err;
      //   console.log(`${imageName} was deleted`);
      // });
      await file.delete();
    }

    await recipe.destroy();

    return res.status(200).json({
      success: true,
      message: 'Successful Delete Recipe!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  };
};

exports.postRecipeBookmark = async (req, res) => {
  try {
    const {recipeSlug} = req.params;

    const recipe = await Recipe.findOne({
      where: {slug: recipeSlug},
    });

    if (!recipe) {
      return res.status(404).json({
        success: true,
        message: 'Recipe Not Found!',
      });
    }

    await Bookmark.create({
      user_id: req.user.id,
      recipe_id: recipe.id,
    });

    return res.status(200).json({
      success: true,
      message: 'Successful Save Recipe to Bookmark',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.postRecipeActivity = async (req, res) => {
  try {
    const {recipeSlug} = req.params;
    const {goal_id} = req.body;

    const recipe = await Recipe.findOne({
      where: {slug: recipeSlug},
      include: NutritionFact,
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe Not Found!',
      });
    }

    const goalCount = await Goal.count();
    const haveGoal = goalCount > 0;

    if (!haveGoal) {
      return res.status(400).json({
        success: false,
        message: 'You not have any goals yet.',
      });
    }

    const isGoalCreated = await Goal.findByPk(goal_id);

    if (!isGoalCreated) {
      return res.status(400).json({
        success: false,
        message: 'Create Your Goal First Before Add Activity',
      });
    }

    const activity = await Activity.create({
      date: new Date(),
      calorie: recipe.NutritionFact.calorie_dose,
      carbo: recipe.NutritionFact.carbo_dose,
      protein: recipe.NutritionFact.protein_dose,
      fat: recipe.NutritionFact.fat_dose,
      user_id: req.user.id,
      goal_id,
    });

    const goal = await Goal.findByPk(activity.goal_id);

    goal.total_calorie += activity.calorie;

    await goal.save();

    return res.status(201).json({
      success: true,
      message: 'Successful Add New Activity',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

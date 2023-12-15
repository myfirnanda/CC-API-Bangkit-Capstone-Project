// const fs = require('fs');
const slugify = require('slugify');
const {Op} = require('sequelize');
const {Storage} = require('@google-cloud/storage');

const Recipe = require('../models/recipeModel');
const NutritionFact = require('../models/nutritionFactModel');
const RecipeIngredient = require('../models/recipeIngredientsModel');
const Bookmark = require('../models/bookmarkModel');
const Activity = require('../models/activityModel');
const Goal = require('../models/goalModel');
const Category = require('../models/categoryModel');
const Type = require('../models/typeModel');
const Ingredient = require('../models/ingredientModel');

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
      include: [
        {
          model: Category,
          attributes: ['name'],
        },
        {
          model: Type,
          attributes: ['name'],
        },
        {
          model: NutritionFact,
          attributes: ['calorie_dose'],
        },
      ],
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
      include: [
        {
          model: Category,
          attributes: ['name'],
        },
        {
          model: Type,
          attributes: ['name'],
        },
        {
          model: NutritionFact,
        },
        {
          model: RecipeIngredient,
          include: [Ingredient],
        },
      ],
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
    const Category = await Category.findAll();
    const Type = await Type.findAll();
    const Ingredient = await Ingredient.findAll();

    return res.status(200).json({
      success: true,
      message: 'Successful Get Add Recipe',
      Category,
      Type,
      Ingredient,
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

    const existingRecipe = await Recipe.findOne({
      where: {name},
    });

    if (existingRecipe) {
      return res.status(400).json({
        success: false,
        message: 'Recipe Already Exist!',
      });
    }

    const imageName = req.file;

    const storageBucket = process.env.GCP_STORAGE_BUCKET_NAME;
    const storageClient = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_KEY_FILENAME,
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
      predefinedAcl: 'publicRead',
    });

    stream.on('finish', () => {
      res.status(200);
    });

    stream.on('error', () => {
      res.status(500);
    });

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
      isMandatory,
    }) => ({
      dose,
      unit,
      recipe_id: recipe.id,
      ingredient_id,
      isMandatory,
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
        isMandatory,
      }) => ({
        dose,
        unit,
        ingredient_id,
        isMandatory,
      })),
      file: {
        publicUrl: `https://storage.googleapis.com/${storageBucket}/${fileName}`,
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

exports.getEditRecipe = async (req, res) => {
  try {
    const {recipeSlug} = req.params;

    const recipe = await Recipe.findOne({
      where: {slug: recipeSlug},
      include: [
        {
          model: Category,
          attributes: ['name'],
        },
        {
          model: Type,
          attributes: ['name'],
        },
        {
          model: RecipeIngredient,
          include: [Ingredient],
        },
      ],
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

    return res.status(200).json({
      success: true,
      message: 'Successful Get Edit Recipe',
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

    const existingRecipe = await Recipe.findOne({
      where: {name},
    });

    if (existingRecipe) {
      return res.status(400).json({
        success: false,
        message: 'Recipe Already Exist!',
      });
    }

    const slug = slugify(name, {lower: true});

    const imageName = req.file;

    const oldImage = recipe.image_name;
    const newImage = imageName ?
      `${Date.now()}-${slugify(imageName.originalname, {
        lower: true,
      })}` : oldImage;

    if (imageName) {
      const storageBucket = process.env.GCP_STORAGE_BUCKET_NAME;
      const storageClient = new Storage({
        projectId: process.env.GCP_PROJECT_ID,
        keyFilename: process.env.GCP_KEY_FILENAME,
      });

      const fileName = imageName;

      const bucket = storageClient.bucket(storageBucket);
      const gcsFile = bucket.file(fileName);
      // const imagePath = `./image/images/recipes/${imageName}`;
      // fs.unlink(imagePath, (err) => {
      //   if (err) throw err;
      //   console.log(`${imageName} was deleted`);
      // });
      await gcsFile.delete();

      const stream = gcsFile.createWriteStream({
        metadata: {
          contentType: imageName.mimetype,
        },
        predefinedAcl: 'publicRead',
      });

      await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
      });
    }

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
      isMandatory,
    }) => ({
      dose,
      unit,
      recipe_id: recipe.id,
      ingredient_id,
      isMandatory,
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
        isMandatory,
      }) => ({
        dose,
        unit,
        ingredient_id,
        isMandatory,
      })),
      file: {
        publicUrl: `https://storage.googleapis.com/${storageBucket}/${newImage}`,
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
        projectId: process.env.GCP_PROJECT_ID,
        keyFilename: process.env.GCP_KEY_FILENAME,
      });

      const storageBucket = process.env.GCP_STORAGE_BUCKET_NAME;
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

    await NutritionFact.destroy({
      where: {recipe_id: recipe.id},
    });

    await RecipeIngredient.destroy({
      where: {recipe_id: recipe.id},
    });

    await Bookmark.destroy({
      where: {recipe_id: recipe.id},
    });

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
      error: error,
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

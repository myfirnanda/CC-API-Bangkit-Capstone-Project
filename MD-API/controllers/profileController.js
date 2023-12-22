// const fs = require('fs');
const slugify = require('slugify');

const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');
const NutritionFact = require('../models/nutritionFactModel');
const RecipeIngredient = require('../models/recipeIngredientsModel');
const Bookmark = require('../models/bookmarkModel');
const Activity = require('../models/activityModel');
const Category = require('../models/categoryModel');
const Type = require('../models/typeModel');
const Ingredient = require('../models/ingredientModel');

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      where: {user_id: req.user.id},
      include: [
        {
          model: Recipe,
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
        },
      ],
    });

    if (!activities) {
      return res.status(200).json({
        success: true,
        message: 'No Activities Yet',
        data: activities,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successful Get Activities',
      data: activities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getActivity =async (req, res) => {
  try {
    const {activityId} = req.params;

    const activity = await Activity.findOne({
      where: {id: activityId},
      include: [
        {
          model: Recipe,
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
              model: Ingredient,
              through: RecipeIngredient,
            },
          ],
        },
      ],
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity Not Found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successful Get Activity Detail',
      data: activity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.findAll({
      where: {user_id: req.user.id},
      include: [
        {
          model: Activity,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'Successful Get All Goals',
      data: goals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getGoal = async (req, res) => {
  try {
    const {goalSlug} = req.params;

    const goal = await Goal.findOne({
      where: {slug: goalSlug},
      include: [
        {
          model: Recipe,
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
          ],
        },
      ],
    });

    if (goal.user_id !== req.user.id) {
      return res.status(403).json({
        success: 'false',
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    if (!goal) {
      return res.status(404).json({
        success: 'false',
        message: 'Goal Not Found!',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successful Get Goal',
      data: goal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({email: req.user.email});

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'You are not authenticated as this user',
      });
    }

    const storageBucket = process.env.GCP_STORAGE_BUCKET_NAME;
    const fileName = user.profile_image;

    return res.status(200).json({
      success: true,
      message: 'Successful Get Your Profile',
      publicUrl: `https://storage.googleapis.com/${storageBucket}/${fileName}`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.patchEditUser = async (req, res) => {
  try {
    const {userSlug} = req.params;

    const user = await User.findOne({
      where: {slug: userSlug},
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User Not Found!',
      });
    }

    if (user.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    const {
      name,
      weight,
      height,
      isDairy,
    } = req.body;

    const existingUser = await User.findOne({
      where: {email},
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User Already Exist!',
      });
    }

    const slug = slugify(name, {lower: true});

    const profileImage = req.file;

    const oldImage = user.profile_image;
    const newImage = profileImage ? profileImage.filename : oldImage;

    if (profileImage) {
      const storage = new Storage({
        projectId: process.env.GCP_PROJECT_ID,
        keyFilename: process.env.GCP_KEY_FILENAME,
      });

      const storageBucket = process.env.GCP_STORAGE_BUCKET_NAME;
      const fileName = profileImage;

      const bucket = storage.bucket(storageBucket);
      const file = bucket.file(fileName);
      // const imagePath = `./image/images/recipes/${profileImage}`;
      // fs.unlink(imagePath, (err) => {
      //   if (err) throw err;
      //   console.log(`${profileImage} was deleted`);
      // });
      await file.delete();
    }

    await User.update({
      profile_image: newImage,
      name,
      slug,
      weight,
      height,
      isDairy,
    }, {
      where: {id: req.user.id},
    });

    return res.status(200).json({
      success: true,
      message: 'Successful Edit Profile',
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

exports.deleteUser = async (req, res) => {
  try {
    const {userSlug} = req.params;

    const user = await User.findOne({
      where: {slug: userSlug},
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.slug !== req.user.slug) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot delete someone\'s account',
      });
    }

    const recipes = await Recipe.findAll({
      where: {user_id: req.user.id},
    });

    // Delete associated records
    for (const recipe of recipes) {
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
    }

    const profileImage = user.profile_image;

    if (profileImage) {
      const storage = new Storage({
        projectId: process.env.GCP_PROJECT_ID,
        keyFilename: process.env.GCP_KEY_FILENAME,
      });

      const storageBucket = process.env.GCP_STORAGE_BUCKET_NAME;
      const fileName = profileImage;

      const bucket = storage.bucket(storageBucket);
      const file = bucket.file(fileName);
      // const imagePath = `./image/images/profile/${profileImage}`;
      // fs.unlink(imagePath, (err) => {
      //   if (err) throw err;
      //   console.log(`${profileImage} was deleted`);
      // });
      await file.delete();
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: 'Successful Delete Account',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.findAll({
      where: {user_id: req.user.id},
    });

    if (bookmarks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No Saved Recipes Yet',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successful Get All Saved Recipes',
      data: bookmarks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    const {recipeSlug} = req.params;

    const bookmark = await Recipe.findOne({
      where: {id: recipeSlug},
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found',
      });
    }

    if (bookmark.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not the owner of this bookmark',
      });
    }

    await bookmark.destroy();

    return res.status(200).json({
      success: true,
      message: 'Successful Delete Bookmark!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

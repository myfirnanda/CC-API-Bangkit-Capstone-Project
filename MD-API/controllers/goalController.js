const slugify = require('slugify');
const moment = require('moment');

const Goal = require('../models/goalModel');
const Recipe = require('../models/recipeModel');
const Activity = require('../models/activityModel');
const Category = require('../models/categoryModel');
const Type = require('../models/typeModel');
const NutritionFact = require('../models/nutritionFactModel');
const User = require('../models/userModel');

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
          model: User,
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

exports.getAddGoal = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Successful Get Add Goal',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.postAddGoal = async (req, res) => {
  try {
    const {
      name,
      duration_month,
      target_calorie,
    } = req.body;

    const existingGoal = await Goal.findOne({
      where: {name},
    });

    if (existingGoal) {
      return res.status(400).json({
        success: false,
        message: 'Goal Already Exist!',
      });
    }

    const slug = slugify(name, {lower: true});

    const dueDate = moment().add(duration_month, 'months');

    await Goal.create({
      name,
      slug,
      duration_month: dueDate.format('YYYY-MM-DD HH:mm:ss'),
      total_calorie: 0,
      total_carbo: 0,
      total_protein: 0,
      total_fat: 0,
      target_calorie,
      status: null,
      user_id: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Successful Add New Goal',
      data: {
        name,
        slug,
        duration_month,
        target_calorie,
        total_calorie: 0,
        total_carbo: 0,
        total_protein: 0,
        total_fat: 0,
        status: null,
        user_id: req.user.id,
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

exports.getEditGoal = async (req, res) => {
  try {
    const {goalSlug} = req.params;

    const goal = await Goal.findOne({
      where: {slug: goalSlug},
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal Not Found!',
      });
    }

    if (goal.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successful Get Edit Goal',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.patchEditGoal = async (req, res) => {
  const {goalSlug} = req.params;

  const goal = await Goal.findOne({where: {slug: goalSlug}});

  if (!goal) {
    return res.status(404).json({
      success: true,
      message: 'Goal Not Found!',
    });
  };

  if (goal.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. You are not authenticated as this user',
    });
  }

  if (goal.status != null) {
    return res.status(403).json({
      success: false,
      message: 'Your goal progress is finished, you can\'t edit your goal',
    });
  }

  const {
    name,
    duration_month,
    target_calorie,
  } = req.body;

  const existingGoal = await Goal.findOne({
    where: {name},
  });

  if (existingGoal) {
    return res.status(400).json({
      success: false,
      message: 'Goal Already Exist!',
    });
  }

  const slug = slugify(name, {lower: true});

  const dueDate = moment().add(duration_month, 'months');

  await Goal.update({
    name,
    slug,
    duration_month: dueDate.format('YYYY-MM-DD HH:mm:ss'),
    target_calorie,
  }, {
    where: {slug: goalSlug},
  });

  return res.status(200).json({
    success: true,
    message: 'Successful Update Goal!',
  });
};

exports.deleteGoal = async (req, res) => {
  try {
    const {goalSlug} = req.params;

    const goal = await Goal.findOne({where: {slug: goalSlug}});

    if (!goal) {
      return res.status(400).json({
        success: false,
        message: 'Goal Not Found!',
      });
    }

    if (goal.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    await Activity.destroy({
      where: {goal_id: goal.id},
    });

    await goal.destroy();

    return res.status(200).json({
      success: true,
      message: 'Successful Delete Goal!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

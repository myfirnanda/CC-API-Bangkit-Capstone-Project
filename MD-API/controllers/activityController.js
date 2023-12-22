const moment = require('moment');
const {Op} = require('sequelize');

const Category = require('../models/categoryModel');
const Type = require('../models/typeModel');
const NutritionFact = require('../models/nutritionFactModel');
const Recipe = require('../models/recipeModel');
const Activity = require('../models/activityModel');
const Goal = require('../models/goalModel');

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

    return res.status(200).json({
      success: true,
      message: 'Successful Get All Activity',
      data: activities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const {activityId} = req.params;

    const activity = await Activity.findOne({
      where: {id: activityId},
    });

    if (!activity) {
      return res.status(400).json({
        success: false,
        message: 'Activity Not Found',
      });
    }

    if (activity.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    const goal = await Goal.findByPk(activity.goal_id);

    if (!goal) {
      return res.status(400).json({
        success: false,
        message: 'Goal Not Found',
      });
    }

    goal.total_calorie -= activity.calorie;
    goal.total_carbo -= activity.carbo;
    goal.total_protein -= activity.protein;
    goal.total_fat -= activity.fat;

    await goal.save();

    await activity.destroy();

    return res.status(200).json({
      success: true,
      message: 'Successful Delete Activity',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getActivityByDate = async (req, res) => {
  try {
    const {date} = req.query;
    let queryDate = moment();

    if (date) {
      const offset = parseInt(date);
      queryDate = moment().add(offset, 'days');
    }

    const activities = await Activity.findAll({
      where: {
        date: {
          [Op.gte]: moment(queryDate).startOf('day').toDate(),
          [Op.lt]: moment(queryDate).endOf('day').toDate(),
        },
      },
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

    return res.status(200).json({
      success: true,
      message: 'Successful Get Today Activities',
      activities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

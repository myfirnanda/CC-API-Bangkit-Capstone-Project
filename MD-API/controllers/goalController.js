const slugify = require('slugify');
const moment = require('moment');

const Goal = require('../models/goalModel');

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.findAll({
      where: {user_id: req.user.id},
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
    });

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

exports.postGoal = async (req, res) => {
  try {
    const {
      name,
      duration_month,
      target_calorie,
    } = req.body;

    const slug = slugify(name, {lower: true});

    const dueDate = moment().add(duration_month, 'months');

    await Goal.create({
      name,
      slug,
      duration_month: dueDate.format('YYYY-MM-DD HH:mm:ss'),
      total_calorie: 0,
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

  const {
    name,
    duration_month,
    target_calorie,
  } = req.body;

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

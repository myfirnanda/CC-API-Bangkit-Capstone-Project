const moment = require('moment');

const Activity = require('../models/activityModel');
const Goal = require('../models/goalModel');

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      where: {user_id: req.user.id},
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

exports.getActivity =async (req, res) => {
  try {
    const {activityId} = req.params;

    const activity = await Activity.findOne({
      where: {id: activityId},
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
    const parsedDate = parseInt(date);

    if (isNaN(parsedDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please provide a valid number for date.',
      });
    }

    const requestDate = date ?
    moment().add(parseInt(parsedDate), 'days') :
    moment();

    const activities = await Activity.findAll({
      where: {date: requestDate.toDate()},
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

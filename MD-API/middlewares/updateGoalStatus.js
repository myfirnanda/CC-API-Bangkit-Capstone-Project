const Goal = require('../models/goalModel');

exports.updateGoalStatus = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token || !req.user) {
      return next();
    }

    const currentTime = new Date();
    const goals = await Goal.findAll({
      where: {user_id: req.user.id},
    });

    if (goals.length === 0) {
      return next();
    }

    await Promise.all(goals.map(async (goal) => {
      let status = null;

      if (currentTime <= goal.duration_month) {
        if (
          goal.target_calorie === 0 || goal.total_calorie >= goal.target_calorie
        ) {
          status = true;
        } else {
          status = false;
        }
      } else {
        status = false;
      }

      await goal.update({status});
    }));

    next();
  } catch (error) {
    console.error(`Error in updateGoalStatus middleware: ${error.message}`);
    next(error);
  }
};

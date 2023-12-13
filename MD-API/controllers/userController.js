const User = require('../models/userModel');

exports.getUsers = async (req, res) => {
  try {
    const user = await User.findAll();

    return res.status(200).json({
      success: true,
      message: 'Successful Get All User',
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

exports.getUser = async (req, res) => {
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

    return res.status(200).json({
      success: true,
      message: 'Successful Get User',
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

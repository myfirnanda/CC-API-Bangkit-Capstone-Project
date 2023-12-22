const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAuth = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'User not authenticated',
      error: 'Forbidden',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Token',
      });
    }

    const user = await User.findOne({where: {email: decodedToken.email}});

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found based on token information',
        error: 'Unauthorized',
      });
    }

    req.user = user;

    next();
  });
};

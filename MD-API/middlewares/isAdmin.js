const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAdmin = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
      error: 'Unauthorized',
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

    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'User is not an admin',
        error: 'Forbidden',
      });
    }

    req.user = user;

    console.log(decodedToken);
    next();
  });
};

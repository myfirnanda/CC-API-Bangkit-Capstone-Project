const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');

const User = require('../models/userModel');
const UserAllergy = require('../models/userAllergyModel');

const maxAge = 7 * 24 * 60 * 60; // 1 WEEK EXPIRES
const createToken = (email) => {
  return jwt.sign({email}, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

exports.getSignup = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Successful Get Signup',
  });
};

exports.postSignup = async (req, res) => {
  try {
    const profileImage = req.file;

    const {
      name,
      email,
      password,
      weight,
      height,
      isDiary,
      allergies,
    } = req.body;

    const slug = slugify(name, {lower: true});

    const existingUser = await User.findOne({
      where: {email},
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User Already Exist!',
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    const isProfileImage = profileImage ? profileImage.filename : '';

    const user = await User.create({
      profile_image: isProfileImage,
      name,
      slug,
      email,
      password: hashedPassword,
      weight,
      height,
      isDiary,
    });

    const userAllergiesData = allergies.map(({allergy_id}) => ({
      user_id: user.id,
      allergy_id,
    }));

    await UserAllergy.bulkCreate(userAllergiesData);

    return res.status(201).json({
      success: true,
      message: 'Successful Signup!',
      dataUser: req.body,
      file: req.file,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  };
};

exports.getLogin = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Successful Get Login',
  });
};

exports.postLogin = async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  try {
    const user = await User.findOne({
      where: {email},
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Email / Password. Try again!',
      });
    }

    const match = await bcryptjs.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Email / Password!',
      });
    }

    const token = createToken(user.email);
    res.cookie('jwt', token, {httpOnly: true, maxAge});
    req.isLoggedIn = true;

    return res.status(200).json({
      success: true,
      message: 'Successful Login!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  };
};

exports.postLogout = (req, res) => {
  try {
    res.clearCookie('jwt');
    req.isLoggedIn = false;
    return res.status(200).json({
      success: true,
      message: 'Successful Logout!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  };
};

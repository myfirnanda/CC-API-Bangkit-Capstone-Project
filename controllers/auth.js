const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const maxAge = 7 * 24 * 60 * 60; // 1 WEEK EXPIRES
const createToken = (email) => {
  return jwt.sign({email}, 'jwt secret', {
    expiresIn: maxAge,
  });
};

exports.getSignup = (req, res) => res.status(200).send('Sign Up Page');

exports.postSignup = async (req, res) => {
  const {
    name,
    email,
    password,
  } = req.body;

  try {
    const existingUser = await User.findOne({where: {email}});
    if (existingUser) {
      return res.status(400).json({message: 'User sudah ada'});
    }

    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    await User.create({name, email, password: hashedPassword});

    return res.status(201).json({message: 'Berhasil cuy'});
  } catch (error) {
    return res.status(500).json({message: 'Gagal Chuaakss'});
  }
};

exports.getLogin = (req, res) => {
  res.status(200).json({success: true, message: 'Login Page'});
};

exports.postLogin = async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  try {
    const user = await User.findOne({where: {email}});
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'Email / Password Salah!',
      });
    }

    const match = await bcryptjs.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: 'Email / Password Salah!',
      });
    }

    const token = createToken(user.email);
    res.cookie('jwt', token, {httpOnly: true, maxAge});

    res.status(200).json({success: true, message: 'Berhasil Login'});
  } catch (error) {
    return res.status(500).json({success: false, message: 'Gagal Chuaks'});
  }
};

exports.postLogout = (req, res) => {
  try {
    res.clearCookie('jwt');
    res.status(200).json({success: true, message: 'Berhasil Logout'});
  } catch (error) {
    es.status(500).json({success: false, message: 'Terjadi kesalahan'});
  }
};

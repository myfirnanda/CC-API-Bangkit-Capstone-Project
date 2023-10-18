const bcryptjs = require('bcryptjs');
const User = require('../models/User');

exports.getSignup = (req, res) => res.status(200).send('Hello World');

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
    return res.status(200).json({message: 'Berhasil cuy'});
  } catch (error) {
    return res.status(500).json({message: 'Gagal Chuaakss'});
  }
};

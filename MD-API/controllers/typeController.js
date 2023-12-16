const slugify = require('slugify');

const Recipe = require('../models/recipeModel');
const Type = require('../models/typeModel');

exports.getTypes = async (req, res) => {
  try {
    const types = await Type.findAll();

    return res.status(200).json({
      success: 'true',
      message: 'Successful Get All Types',
      data: types,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getType = async (req, res) => {
  try {
    const {typeSlug} = req.params;

    const type = await Type.findOne({
      where: {slug: typeSlug},
    });

    if (!type) {
      return res.json(404).json({
        success: false,
        message: 'Type Not Found!',
      });
    }

    const recipes = await Recipe.findAll({
      where: {type_id: type.id},
    });

    res.status(200).json({
      success: true,
      message: 'Successful Get Type Detail',
      dataType: type,
      dataRecipes: recipes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getAddType = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Successful Get Add Type',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.postAddType = async (req, res) => {
  try {
    const {name} = req.body;

    const existingType = await Type.findOne({
      where: {name},
    });

    if (existingType) {
      return res.status(400).json({
        success: false,
        message: 'User Already Exist!',
      });
    }

    const slug = slugify(name, {lower: true});

    await Type.create({
      name,
      slug,
    });

    return res.status(200).json({
      success: 'true',
      message: 'Successful Add New Type',
      data: req.body,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getEditType = async (req, res) => {
  try {
    const {typeSlug} = req.params;

    const type = await Type.findOne({
      where: {slug: typeSlug},
    });

    if (!type) {
      return res.status(404).json({
        success: false,
        message: 'Type Not Found!',
      });
    }

    if (!type.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successful Get Edit Type',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.patchEditType = async (req, res) => {
  try {
    const {typeSlug} = req.params;

    const type = Type.findOne({
      where: {slug: typeSlug},
    });

    if (!type) {
      return res.status(404).json({
        success: false,
        message: 'Type Not Found!',
      });
    }

    if (!type.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    const {name} = req.body;

    const existingType = await Type.findOne({
      where: {name},
    });

    if (existingType) {
      return res.status(400).json({
        success: false,
        message: 'User Already Exist!',
      });
    }

    const slug = slugify(name, {lower: true});

    await type.update({
      name,
      slug,
    });

    return res.status(200).json({
      success: true,
      message: 'Successful Update Type',
      data: req.body,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.deleteType = async (req, res) => {
  try {
    const {typeSlug} = req.params;

    const type = await Type.findOne({where: {type: typeSlug}});

    if (!type) {
      return res.status(404).json({
        success: false,
        message: 'Type Not Found!',
      });
    }

    if (!type.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    await type.destroy();

    return res.status(200).json({
      name: '',
      message: 'Successful Delete Type',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

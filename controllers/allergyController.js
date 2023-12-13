const slugify = require('slugify');

const Allergy = require('../models/allergyModel');
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');

exports.getAllergies = async (req, res) => {
  try {
    const allergies = await Allergy.findAll({
      include: {
        model: Recipe,
        as: 'recipes',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Successful Get All Categories',
      data: allergies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.getAllergy = async (req, res) => {
  try {
    const {allergySlug} = req.body;

    const allergy = await Allergy.findOne({
      where: {slug: allergySlug},
      include: {
        model: Recipe,
        as: 'recipes',
      },
    });

    if (!allergy) {
      return res.status(404).json({
        success: false,
        message: 'Allergy Not Found!',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successful Get All Allergy',
      data: allergy,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.getAddAllergy = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Successful Get Allergy',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.postAddAllergy = async (req, res) => {
  try {
    const {
      name,
      description,
    } = req.body;

    const slug = slugify(name, {lower: true});

    await Allergy.create({
      name,
      slug,
      description,
    });

    return res.status(200).json({
      success: true,
      message: 'Successful Add Allergy',
      data: {
        name,
        slug,
        description,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.getEditAllergy = async (req, res) => {
  try {
    const {allergySlug} = req.params;

    const allergy = await Allergy.findOne({
      where: {slug: allergySlug},
    });

    if (!allergy) {
      return res.status(404).json({
        success: false,
        message: 'Allergy Not Found!',
      });
    }

    if (allergy.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successful Get Edit Allergy',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.patchEditAllergy = async (req, res) => {
  try {
    const {allergySlug} = req.params;

    const allergy = await Allergy.findOne({
      where: {slug: allergySlug},
    });

    if (!allergy) {
      return res.status(404).json({
        success: false,
        message: 'Allergy not Found',
      });
    }

    if (allergy.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    const user = await User.findOne({
      where: {id: req.user.id},
    });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot delete someone\'s account',
      });
    }

    const {name, description} = req.body;

    const slug = slugify(name, {lower: true});

    await Allergy.update({
      name,
      slug,
      description,
    }, {
      where: {id: req.user.id},
    });

    return res.status(200).json({
      success: 'true',
      message: 'Successful Update Allergy',
      data: {
        name,
        slug,
        description,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.deleteAllergy = async (req, res) => {
  try {
    const {allergySlug} = req.params;

    const allergy = await allergy.findOne({
      where: {slug: allergySlug},
    });

    if (!allergy) {
      return res.status(404).json({
        success: false,
        message: 'Allergy Not Found!',
      });
    }

    if (allergy.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    await allergy.destroy();

    return res.status(200).json({
      success: true,
      message: 'Successful Delete Allergy',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

const fs = require('fs');
const slugify = require('slugify');

const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');
const Bookmark = require('../models/bookmarkModel');
const Activity = require('../models/activityModel');

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      where: {user_id: req.user.id},
    });

    if (!activities) {
      return res.status(200).json({
        success: true,
        message: 'No Activities Yet',
        data: activities,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successful Get Activities',
      data: activities,
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
    const user = await User.findOne({email: req.user.email});

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'You are not authenticated as this user',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successful Get Your Profile',
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

exports.patchEditUser = async (req, res) => {
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

    if (user.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authenticated as this user',
      });
    }

    const profileImage = req.file;

    const oldImage = user.image_profile;
    const newImage = profileImage ? profileImage.filename : oldImage;

    if (profileImage) {
      fs.unlink(`storage/images/profiles/${oldImage}`, (err) => {
        if (err) throw err;
        console.log(`${oldImage} was deleted`);
      });
    }

    const {
      name,
      weight,
      height,
      isVegan,
    } = req.body;

    const slug = slugify(name, {lower: true});

    await User.update({
      image_profile: newImage,
      name,
      slug,
      weight,
      height,
      isVegan,
    }, {
      where: {id: req.user.id},
    });

    return res.status(200).json({
      success: true,
      message: 'Successful Edit Profile',
      data: req.body,
      file: req.file,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const {userSlug} = req.params;

    const user = await User.findOne({
      where: {slug: userSlug},
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.slug !== req.user.slug) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot delete someone\'s account',
      });
    }

    const profileImage = user.image_profile;

    if (profileImage) {
      const storagePath = `./storage/images/profiles/${profileImage}`;
      fs.unlink(storagePath, (err) => {
        if (err) throw err;
        console.log(`${profileImage} was deleted`);
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: 'Successful Delete Account',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.findAll({
      where: {user_id: req.user.id},
      include: {
        model: Recipe,
        as: 'recipes',
      },
    });

    if (bookmarks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No Saved Recipes Yet',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successful Get All Saved Recipes',
      data: bookmarks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    const {recipeSlug} = req.params;

    const bookmark = await Recipe.findOne({where: {id: recipeSlug}});

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found',
      });
    }

    if (bookmark.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not the owner of this bookmark',
      });
    }

    await bookmark.destroy();

    return res.status(200).json({
      success: true,
      message: 'Successful Delete Bookmark!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

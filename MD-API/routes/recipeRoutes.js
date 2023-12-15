const {Router} = require('express');
// const slugify = require('slugify');
const multer = require('multer');
// const path = require('path');

const router = Router();

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, './storage/images/recipes');
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const fileName = slugify(file.originalname.replace(ext, ''), {
//       lower: true,
//     });
//     const timestamp = Date.now();
//     const newFilename = `${fileName}-${timestamp}${ext}`;
//     cb(null, newFilename);
//   },
// });

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});

const {
  getRecipe,
  getRecipes,
  getAddRecipe,
  postAddRecipe,
  getEditRecipe,
  patchEditRecipe,
  deleteRecipe,
  postRecipeActivity,
  postRecipeBookmark,
} = require('../controllers/recipeController');

const {isAuth} = require('../middlewares/isAuth');
const {isAdmin} = require('../middlewares/isAdmin');

router.get('/', isAuth, getRecipes);
router.get('/add', isAdmin, getAddRecipe);
router.post('/add', isAdmin, upload.single('image_name'), postAddRecipe);
router.get('/:recipeSlug/edit', isAdmin, getEditRecipe);
router.patch(
    '/:recipeSlug/edit',
    upload.single('image_name'),
    isAdmin,
    patchEditRecipe,
);
router.delete('/:recipeSlug', isAdmin, deleteRecipe);
router.post('/:recipeSlug/bookmark', isAuth, postRecipeBookmark);
router.post('/:recipeSlug/activity', isAuth, postRecipeActivity);
router.get('/:recipeSlug', isAuth, getRecipe);

module.exports = router;

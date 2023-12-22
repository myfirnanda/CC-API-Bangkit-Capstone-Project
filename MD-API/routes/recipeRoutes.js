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
router.get('/:recipeSlug', isAuth, getRecipe);
router.get('/add', isAdmin, getAddRecipe);
router.post('/add', isAdmin, upload.single('image_name'), postAddRecipe);
router.get('/:recipeSlug/edit', isAdmin, getEditRecipe);
router.patch(
    '/:recipeSlug/edit',
    upload.single('image_name'),
    isAdmin,
    patchEditRecipe,
);
router.delete('/:recipeSlug/delete', isAdmin, deleteRecipe);
router.post('/:recipeSlug/bookmark', isAuth, postRecipeBookmark);
router.post('/:recipeSlug/activity', isAuth, postRecipeActivity);

/**
 * @swagger
 * paths:
 *   /recipes?search&limit=3:
 *     get:
 *       tags:
 *         - Recipe
 *       summary: Get Recipes
 *       description: Retrieve a list of recipes. Accessible to all users.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /recipes/{recipeSlug}:
 *     get:
 *       tags:
 *         - Recipe
 *       summary: Get Recipe by Slug
 *       description: Retrieve detailed information about a specific recipe using its slug. Accessible to all users.
 *       parameters:
 *         - in: path
 *           name: recipeSlug
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /recipes/add:
 *     get:
 *       tags:
 *         - Recipe
 *       summary: Get Page to Add Recipe
 *       description: Retrieve the page to add a new recipe. Accessible only to authenticated users.
 *       responses:
 *         200:
 *           description: OK
 *         401:
 *           description: Unauthorized - User not logged in
 *         500:
 *           description: Internal Server Error
 *     post:
 *       tags:
 *         - Recipe
 *       summary: Add New Recipe
 *       description: Add a new recipe. Accessible only to authenticated users.
 *       responses:
 *         200:
 *           description: OK
 *         401:
 *           description: Unauthorized - User not logged in
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /recipes/{recipeSlug}/edit:
 *     get:
 *       tags:
 *         - Recipe
 *       summary: Get Page to Edit Recipe
 *       description: Retrieve the page to edit a specific recipe. Accessible only to authenticated users.
 *       parameters:
 *         - in: path
 *           name: recipeSlug
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: OK
 *         401:
 *           description: Unauthorized - User not logged in
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *     patch:
 *       tags:
 *         - Recipe
 *       summary: Edit Recipe
 *       description: Edit a specific recipe. Accessible only to authenticated users.
 *       parameters:
 *         - in: path
 *           name: recipeSlug
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: OK
 *         401:
 *           description: Unauthorized - User not logged in
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /recipes/{recipeSlug}/delete:
 *     delete:
 *       tags:
 *         - Recipe
 *       summary: Delete Recipe
 *       description: Delete a specific recipe. Accessible only to authenticated users.
 *       parameters:
 *         - in: path
 *           name: recipeSlug
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: OK
 *         401:
 *           description: Unauthorized - User not logged in
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /recipes/{recipeSlug}/bookmark:
 *     post:
 *       tags:
 *         - Recipe
 *       summary: Bookmark Recipe
 *       description: Bookmark a specific recipe. Accessible only to authenticated users.
 *       parameters:
 *         - in: path
 *           name: recipeSlug
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: OK
 *         401:
 *           description: Unauthorized - User not logged in
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /recipes/{recipeSlug}/activity:
 *     post:
 *       tags:
 *         - Recipe
 *       summary: Add Activity for Recipe
 *       description: Add activity for a specific recipe. Accessible only to authenticated users.
 *       parameters:
 *         - in: path
 *           name: recipeSlug
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: OK
 *         401:
 *           description: Unauthorized - User not logged in
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 */

module.exports = router;

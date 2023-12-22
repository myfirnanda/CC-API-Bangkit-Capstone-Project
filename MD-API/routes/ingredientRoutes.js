const {Router} = require('express');
// const slugify = require('slugify');
const multer = require('multer');
// const path = require('path');

const router = Router();

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, './storage/images/ingredients');
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
    fileSize: 2 * 1024 * 1024,
  },
});

const {
  getIngredients,
  getIngredient,
  getAddIngredient,
  postAddIngredient,
  getEditIngredient,
  patchEditIngredient,
  deleteIngredient,
} = require('../controllers/ingredientController');

const {isAdmin} = require('../middlewares/isAdmin');

router.get('/', isAdmin, getIngredients);
router.get('/:ingredientSlug', isAdmin, getIngredient);
router.get('/add', isAdmin, getAddIngredient);
router.post('/add', isAdmin, upload.single('image_name'), postAddIngredient);
router.get('/:ingredientSlug/edit', isAdmin, getEditIngredient);
router.patch(
    '/:ingredientSlug/edit',
    isAdmin,
    upload.single('image_name'),
    patchEditIngredient,
);
router.delete('/:ingredientSlug/delete', isAdmin, deleteIngredient);

/**
 * @swagger
 * paths:
 *   /ingredients:
 *     get:
 *       tags:
 *         - Ingredient
 *       summary: Get Ingredients
 *       description: Retrieve a list of all ingredients.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /ingredients/{ingredientSlug}:
 *     get:
 *       tags:
 *         - Ingredient
 *       summary: Get Ingredient by Slug
 *       description: Retrieve details of a specific ingredient based on its unique slug.
 *       parameters:
 *         - in: path
 *           name: ingredientSlug
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
 *   /ingredients/add:
 *     get:
 *       tags:
 *         - Ingredient
 *       summary: Get Page to Add a New Ingredient
 *       description: Retrieve and display the page used to add a new ingredient.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *     post:
 *       tags:
 *         - Ingredient
 *       summary: Add a New Ingredient
 *       description: Process the addition of a new ingredient based on the provided information.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /ingredients/{ingredientSlug}/edit:
 *     get:
 *       tags:
 *         - Ingredient
 *       summary: Get Page to Edit an Ingredient
 *       description: Retrieve and display the page used to edit an existing ingredient.
 *       parameters:
 *         - in: path
 *           name: ingredientSlug
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
 *     patch:
 *       tags:
 *         - Ingredient
 *       summary: Edit an Ingredient
 *       description: Process the modification of an existing ingredient based on the provided information.
 *       parameters:
 *         - in: path
 *           name: ingredientSlug
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
 *   /ingredients/{ingredientSlug}/delete:
 *     delete:
 *       tags:
 *         - Ingredient
 *       summary: Delete an Ingredient
 *       description: Process the deletion of an existing ingredient based on its unique slug.
 *       parameters:
 *         - in: path
 *           name: ingredientSlug
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
 */

module.exports = router;

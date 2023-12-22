const {Router} = require('express');

const router = Router();

const {
  getCategories,
  getCategory,
  getAddCategory,
  postAddCategory,
  getEditCategory,
  patchEditCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const {isAuth} = require('../middlewares/isAuth');

router.get('/', getCategories);
router.get('/:categorySlug', isAuth, getCategory);
router.get('/add', isAuth, getAddCategory);
router.post('/add', isAuth, postAddCategory);
router.get('/:categorySlug/edit', isAuth, getEditCategory);
router.patch('/:categorySlug/edit', isAuth, patchEditCategory);
router.delete('/:categorySlug/delete', isAuth, deleteCategory);

/**
 * @swagger
 * paths:
 *   /categories:
 *     get:
 *       tags:
 *         - Category
 *       summary: Get Categories
 *       description: Retrieve a list of all categories.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /categories/{categoriesSlug}:
 *     get:
 *       tags:
 *         - Category
 *       summary: Get Category by Slug
 *       description: Retrieve details of a specific category based on its unique slug.
 *       parameters:
 *         - in: path
 *           name: categoriesSlug
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
 *   /categories/add:
 *     get:
 *       tags:
 *         - Category
 *       summary: Get Page to Add a New Category
 *       description: Retrieve and display the page used to add a new category.
 *     post:
 *       tags:
 *         - Category
 *       summary: Add a New Category
 *       description: Process the addition of a new category based on the provided information.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /categories/{categoriesSlug}/edit:
 *     get:
 *       tags:
 *         - Category
 *       summary: Get Page to Edit a Category
 *       description: Retrieve and display the page used to edit an existing category.
 *       parameters:
 *         - in: path
 *           name: categoriesSlug
 *           required: true
 *           schema:
 *             type: string
 *     patch:
 *       tags:
 *         - Category
 *       summary: Edit a Category
 *       description: Process the modification of an existing category based on the provided information.
 *       parameters:
 *         - in: path
 *           name: categoriesSlug
 *           required: true
 *           schema:
 *             type: string
 *
 *   /categories/{categoriesSlug}/delete:
 *     delete:
 *       tags:
 *         - Category
 *       summary: Delete a Category
 *       description: Process the deletion of an existing category based on its unique slug.
 *       parameters:
 *         - in: path
 *           name: categoriesSlug
 *           required: true
 *           schema:
 *             type: string
 */

module.exports = router;

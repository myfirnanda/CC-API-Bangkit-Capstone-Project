const {Router} = require('express');

const router = Router();

const {
  getTypes,
  getType,
  getAddType,
  postAddType,
  getEditType,
  patchEditType,
  deleteType,
} = require('../controllers/typeController');

const {isAdmin} = require('../middlewares/isAdmin');

router.get('/', isAdmin, getTypes);
router.get('/:typeSlug', isAdmin, getType);
router.get('/add', isAdmin, getAddType);
router.post('/add', isAdmin, postAddType);
router.get('/:typeSlug/edit', isAdmin, getEditType);
router.patch('/:typeSlug/edit', isAdmin, patchEditType);
router.delete('/:typeSlug/delete', isAdmin, deleteType);

/**
 * @swagger
 * paths:
 *   /types:
 *     get:
 *       tags:
 *         - Type
 *       summary: Get Types
 *       description: Retrieve a list of types.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /types/{typeSlug}:
 *     get:
 *       tags:
 *         - Type
 *       summary: Get Type by Slug
 *       description: Retrieve detailed information about a specific type using its slug.
 *       parameters:
 *         - in: path
 *           name: typeSlug
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
 *   /types/add:
 *     get:
 *       tags:
 *         - Type
 *       summary: Get Page to Add Type
 *       description: Retrieve the page to add a new type.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *     post:
 *       tags:
 *         - Type
 *       summary: Add New Type
 *       description: Add a new type.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /types/{typeSlug}/edit:
 *     get:
 *       tags:
 *         - Type
 *       summary: Get Page to Edit Type
 *       description: Retrieve the page to edit a specific type.
 *       parameters:
 *         - in: path
 *           name: typeSlug
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
 *         - Type
 *       summary: Edit Type
 *       description: Edit a specific type.
 *       parameters:
 *         - in: path
 *           name: typeSlug
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
 *   /types/{typeSlug}/delete:
 *     delete:
 *       tags:
 *         - Type
 *       summary: Delete Type
 *       description: Delete a specific type.
 *       parameters:
 *         - in: path
 *           name: typeSlug
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

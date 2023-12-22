const {Router} = require('express');

const router = Router();

const {getUsers, getUser} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/:userSlug', getUser);

/**
 * @swagger
 * paths:
 *   /users:
 *     get:
 *       tags:
 *         - User
 *       summary: Get Users
 *       description: Retrieve a list of users.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /users/{userSlug}:
 *     get:
 *       tags:
 *         - User
 *       summary: Get User by Slug
 *       description: Retrieve detailed information about a specific user using its slug.
 *       parameters:
 *         - in: path
 *           name: userSlug
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

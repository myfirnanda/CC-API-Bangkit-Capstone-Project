const {Router} = require('express');

const router = Router();

const {
  getGoals,
  getGoal,
  getAddGoal,
  postAddGoal,
  getEditGoal,
  patchEditGoal,
  deleteGoal,
} = require('../controllers/goalController');

const {isAuth} = require('../middlewares/isAuth');
const {updateGoalStatus} = require('../middlewares/updateGoalStatus');

router.get('/', isAuth, updateGoalStatus, getGoals);
router.get('/:goalSlug', isAuth, updateGoalStatus, getGoal);
router.get('/add', isAuth, getAddGoal);
router.post('/add', isAuth, postAddGoal);
router.get('/:goalSlug/edit', isAuth, getEditGoal);
router.patch('/:goalSlug/edit', isAuth, patchEditGoal);
router.delete('/:goalSlug/delete', isAuth, deleteGoal);

/**
 * @swagger
 * paths:
 *   /goals:
 *     get:
 *       tags:
 *         - Goal
 *       summary: Get Goals
 *       description: Retrieve a list of all goals.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /goals/{goalSlug}:
 *     get:
 *       tags:
 *         - Goal
 *       summary: Get Goal by Slug
 *       description: Retrieve details of a specific goal based on its unique slug.
 *       parameters:
 *         - in: path
 *           name: goalSlug
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
 *   /goals/add:
 *     get:
 *       tags:
 *         - Goal
 *       summary: Get Page to Add a New Goal
 *       description: Retrieve and display the page used to add a new goal.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *     post:
 *       tags:
 *         - Goal
 *       summary: Add a New Goal
 *       description: Process the addition of a new goal based on the provided information.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /goals/{goalSlug}/edit:
 *     get:
 *       tags:
 *         - Goal
 *       summary: Get Page to Edit a Goal
 *       description: Retrieve and display the page used to edit an existing goal.
 *       parameters:
 *         - in: path
 *           name: goalSlug
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
 *         - Goal
 *       summary: Edit a Goal
 *       description: Process the modification of an existing goal based on the provided information.
 *       parameters:
 *         - in: path
 *           name: goalSlug
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
 *   /goals/{goalSlug}/delete:
 *     delete:
 *       tags:
 *         - Goal
 *       summary: Delete a Goal
 *       description: Process the deletion of an existing goal based on its unique slug.
 *       parameters:
 *         - in: path
 *           name: goalSlug
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

const {Router} = require('express');

const router = Router();

const {
  getActivities,
  deleteActivity,
  getActivityByDate,
} = require('../controllers/activityController');

const {isAuth} = require('../middlewares/isAuth');

router.get('/', isAuth, getActivityByDate);
router.get('/history', isAuth, getActivities);
router.delete('/:activityId/delete', isAuth, deleteActivity);

/**
 * @swagger
 * paths:
 *   /activities?date=0:
 *     get:
 *       tags:
 *         - Activity
 *       summary: Get Activities Data Based on the Date of Activity
 *       description: |
 *         Retrieve a list of all activities based on the specified date.
 *         This operation requires authentication.
 *
 *   /activities/history:
 *     get:
 *       tags:
 *         - Activity
 *       summary: Get Activity History
 *       description: |
 *         Retrieve the history of user activities.
 *         This endpoint provides information about past activities.
 *
 *   /activities/{activityId}:
 *     get:
 *       tags:
 *         - Activity
 *       summary: Get a Single Activity
 *       description: |
 *         Retrieve details of a specific user activity identified by its unique ID.
 *         This endpoint is used to get information about a single activity.

 *   /activities/{activityId}/delete:
 *     delete:
 *       tags:
 *         - Activity
 *       summary: Delete an Activity
 *       description: |
 *         Delete the specified user activity by its unique ID.
 *         This operation removes the activity from the system.
 */

module.exports = router;

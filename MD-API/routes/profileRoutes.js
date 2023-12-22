const {Router} = require('express');
const multer = require('multer');
const router = Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './storage/images/profiles');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = slugify(file.originalname.replace(ext, ''), {
      lower: true,
    });
    const timestamp = Date.now();
    const newFilename = `${fileName}-${timestamp}${ext}`;
    cb(null, newFilename);
  },
});

const upload = multer({storage: storage});

const {
  getActivities,
  getActivity,
  getGoals,
  getGoal,
  patchEditUser,
  deleteUser,
  getBookmarks,
  deleteBookmark,
  getUser,

} = require('../controllers/profileController');

const {isAuth} = require('../middlewares/isAuth');
const {updateGoalStatus} = require('../middlewares/updateGoalStatus');

router.get('/:userSlug?', isAuth, getUser);
router.patch(
    '/:userSlug/edit',
    upload.single('image_profile'),
    isAuth,
    patchEditUser,
);
router.get('/activities', isAuth, getActivities);
router.get('/activities/:activityId', isAuth, getActivity);
router.get('/goals', isAuth, updateGoalStatus, getGoals);
router.get('/goals/:goalSlug', isAuth, updateGoalStatus, getGoal);
router.delete('/:userSlug', isAuth, deleteUser);
router.get('/:userSlug/bookmarks', isAuth, getBookmarks);
router.delete('/:userSlug/bookmarks/:recipeSlug/', isAuth, deleteBookmark);

/**
 * @swagger
 * paths:
 *   /profile/{userSlug?}:
 *     get:
 *       tags:
 *         - Profile
 *       summary: Get Profile by Slug
 *       description: Retrieve the profile information for the specified user slug. Accessible only to authenticated users.
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
 *         401:
 *           description: Unauthorized - User not logged in
 *         500:
 *           description: Internal Server Error

 *   /profile/{userSlug}/edit:
 *     patch:
 *       tags:
 *         - Profile
 *       summary: Edit Profile
 *       description: Edit the profile information for the specified user slug. Accessible only to authenticated users.
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
 *         401:
 *           description: Unauthorized - User not logged in
 *         500:
 *           description: Internal Server Error

 *   /profile/activities:
 *     get:
 *       tags:
 *         - Profile
 *       summary: Get Profile
 *       description: Retrieve the profile information for the authenticated user. Accessible only to authenticated users.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         401:
 *           description: Unauthorized - User not logged in
 *         500:
 *           description: Internal Server Error

 *   /activities/{activityId}:
 *     get:
 *       tags:
 *         - Profile
 *       summary: Get a Single Activity
 *       description: |
 *         Retrieve details of a specific user activity identified by its unique ID.
 *         This endpoint is used to get information about a single activity.

 *   /goals:
 *     get:
 *       tags:
 *         - Profile
 *       summary: Get Goals
 *       description: Retrieve a list of all goals.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error

 *   /goals/{goalSlug}:
 *     get:
 *       tags:
 *         - Profile
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

 *   /profile/{userSlug}/bookmarks:
 *     get:
 *       tags:
 *         - Profile
 *       summary: Get Bookmarks
 *       description: Retrieve the bookmarked items for the specified user slug. Accessible only to authenticated users.
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
 *         401:
 *           description: Unauthorized - User not logged in
 *         500:
 *           description: Internal Server Error

 *   /profile/{userSlug}/bookmarks/{recipeSlug}:
 *     delete:
 *       tags:
 *         - Profile
 *       summary: Remove Bookmark
 *       description: Remove the bookmark for the specified recipe slug. Accessible only to authenticated users.
 *       parameters:
 *         - in: path
 *           name: userSlug
 *           required: true
 *           schema:
 *             type: string
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
 *         401:
 *           description: Unauthorized - User not logged in
 *         500:
 *           description: Internal Server Error
 */

module.exports = router;

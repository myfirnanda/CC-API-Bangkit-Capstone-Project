const {Router} = require('express');
const multer = require('multer');

const router = Router();

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, '/tmp/my-uploads');
//   },
//   filename: function(req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix);
//   },
// });

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  postLogout,
} = require('../controllers/authController');

const {isAuth} = require('../middlewares/isAuth');

router.get('/signup', getSignup);
router.post('/signup', upload.single('profile_image'), postSignup);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/logout', isAuth, postLogout);

/**
 * @swagger
 * paths:
 *   /signup:
 *     get:
 *       tags:
 *         - Auth
 *       summary: Display Signup Page
 *       description: Retrieve and display the signup page. This page is used for user registration.
 *       responses:
 *         200:
 *           description: Successful Response
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     StudentID:
 *                       type: integer
 *                       example: 1
 *                     StudentName:
 *                       type: string
 *                       example: Peter
 *                     StudentRemarks:
 *                       type: string
 *                       example: High Grade Student
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *     post:
 *       tags:
 *         - Auth
 *       summary: User Signup
 *       description: Process user signup based on the provided information. This endpoint is used to create a new user account.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /login:
 *     get:
 *       tags:
 *         - Auth
 *       summary: Display Login Page
 *       description: Retrieve and display the login page. Users can log in with their credentials on this page.
 *       responses:
 *         200:
 *           description: Successful Response
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     StudentID:
 *                       type: integer
 *                       example: 1
 *                     StudentName:
 *                       type: string
 *                       example: Peter
 *                     StudentRemarks:
 *                       type: string
 *                       example: High Grade Student
 *     post:
 *       tags:
 *         - Auth
 *       summary: User Login
 *       description: Process user login based on the provided credentials. This endpoint validates user credentials and logs them into the system.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 *
 *   /logout:
 *     post:
 *       tags:
 *         - Auth
 *       summary: User Logout
 *       description: Process user logout, terminating the user's session. This endpoint logs the user out of the system.
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request
 *         500:
 *           description: Internal Server Error
 */

module.exports = router;

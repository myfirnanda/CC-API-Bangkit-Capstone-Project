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

module.exports = router;

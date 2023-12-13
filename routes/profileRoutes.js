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
  patchEditUser,
  deleteUser,
  getBookmarks,
  deleteBookmark,
  getUser,

} = require('../controllers/profileController');

const {isAuth} = require('../middlewares/isAuth');

router.get('/activities', isAuth, getActivities);
router.patch(
    '/:userSlug/edit',
    upload.single('image_profile'),
    isAuth,
    patchEditUser,
);
router.delete('/:userSlug', isAuth, deleteUser);
router.get('/:userSlug?/bookmarks', isAuth, getBookmarks);
router.delete('/:userSlug?/bookmarks/:recipeSlug/', isAuth, deleteBookmark);
router.get('/:userSlug?', isAuth, getUser);

module.exports = router;

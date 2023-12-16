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
router.get('/add', isAdmin, getAddIngredient);
router.post('/add', isAdmin, upload.single('image_name'), postAddIngredient);
router.get('/:ingredientSlug/edit', isAdmin, getEditIngredient);
router.patch(
    '/:ingredientSlug/edit',
    isAdmin,
    upload.single('image_name'),
    patchEditIngredient,
);
router.delete('/:ingredientSlug', isAdmin, deleteIngredient);
router.get('/:ingredientSlug', isAdmin, getIngredient);

module.exports = router;

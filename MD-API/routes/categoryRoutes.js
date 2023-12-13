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
router.get('/add', isAuth, getAddCategory);
router.post('/add', isAuth, postAddCategory);
router.get('/:categorySlug/edit', isAuth, getEditCategory);
router.patch('/:categorySlug/edit', isAuth, patchEditCategory);
router.delete('/:categorySlug', isAuth, deleteCategory);
router.get('/:categorySlug', isAuth, getCategory);

module.exports = router;

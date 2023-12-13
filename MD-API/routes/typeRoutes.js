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
router.get('/add', isAdmin, getAddType);
router.post('/add', isAdmin, postAddType);
router.get('/:typeSlug/edit', isAdmin, getEditType);
router.patch('/:typeSlug/edit', isAdmin, patchEditType);
router.delete('/:typeSlug', isAdmin, deleteType);
router.get('/:typeSlug', isAdmin, getType);

module.exports = router;

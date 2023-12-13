const {Router} = require('express');

const router = Router();

const {
  getGoals,
  getGoal,
  postGoal,
  getEditGoal,
  patchEditGoal,
  deleteGoal,
} = require('../controllers/goalController');

const {isAuth} = require('../middlewares/isAuth');

router.get('/', isAuth, getGoals);
router.post('/', isAuth, postGoal);
router.get('/:goalSlug/edit', isAuth, getEditGoal);
router.patch('/:goalSlug/edit', isAuth, patchEditGoal);
router.delete('/:goalSlug', isAuth, deleteGoal);
router.get('/:goalSlug', isAuth, getGoal);

module.exports = router;

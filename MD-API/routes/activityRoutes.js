const {Router} = require('express');

const router = Router();

const {
  getActivities,
  getActivity,
  deleteActivity,
  getActivityByDate,
} = require('../controllers/activityController');

const {isAuth} = require('../middlewares/isAuth');

router.get('/', isAuth, getActivityByDate);
router.get('/history', isAuth, getActivities);
router.get('/:activityId', isAuth, getActivity);
router.delete('/:activityId', isAuth, deleteActivity);

module.exports = router;

const {Router} = require('express');

const router = Router();

const {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  postLogout,
} = require('../controllers/auth');

router.get('/signup', getSignup);
router.post('/signup', postSignup);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/logout', postLogout);

module.exports = router;

const {Router} = require('express');

const router = Router();

const {
  getSignup,
  postSignup,
} = require('../controllers/auth');

router.get('/', getSignup);
router.post('/', postSignup);

module.exports = router;

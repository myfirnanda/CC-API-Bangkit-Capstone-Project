const {Router} = require('express');

const router = Router();

const {getUsers, getUser} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/:userSlug', getUser);

module.exports = router;

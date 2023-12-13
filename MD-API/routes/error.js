const {Router} = require('express');

const router = Router();

const {get404} = require('../controllers/errorController');

router.get('/*', get404);

module.exports = router;

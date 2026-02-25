var express = require('express');
var router = express.Router();
const ctrlMain = require('../controllers/main');

router.get('/', ctrlMain.index);
router.get('/reservations', ctrlMain.reservations);
router.get('/checkout', ctrlMain.checkout);
router.get('/logout', ctrlMain.logout);

module.exports = router;

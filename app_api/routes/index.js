const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');

// Route to get the list of all trips
router.route('/trips').get(tripsController.tripsList);

// GET Method routes tripsFindByCode - requries parameter
router.route('/trips/:tripCode').get(tripsController.tripsFindByCode);

module.exports = router;
const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');

// Define the route for /trips with GET and POST methods
router
    .route('/trips')
    .get(tripsController.tripsList) // GET Method routes tripsList
    .post(tripsController.tripsAddTrip); // POST Method Add a new trip

// GET Method routes tripsFindByCode - requries parameter
router.route('/trips/:tripCode').get(tripsController.tripsFindByCode);

module.exports = router;
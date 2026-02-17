const express = require('express');
const router = express.Router();

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

router
    .route('/register')
    .post(authController.register); // POST Method routes register

router
    .route('/login')
    .post(authController.login); // POST Method routes login

// Define the route for /trips with GET and POST methods
router
    .route('/trips')
    .get(tripsController.tripsList) // GET Method routes tripsList
    .post(tripsController.tripsAddTrip); // POST Method Add a new trip


router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) // GET Method routes tripsFindByCode
    .put(tripsController.tripsUpdateTrip); // PUT Method updates a trip

module.exports = router;
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader == null) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }

    let headers = authHeader.split(' ');
    if (headers.length < 1) {
        console.log('Not enough tokens in Auth Header: ' + headers.length);
        return res.sendStatus(501);
    }

    const token = authHeader.split(' ')[1];
    if (token == null) {
        console.log('Null Bearer Token');
        return res.sendStatus(401);
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            return res.sendStatus(401).json('Token Validation Error!');
        }
        req.auth = verified; // Set the auth param to the decoded object
    });

    next(); // Continue to next middleware/handler
}

// Middleware to require admin role (must be used AFTER authenticateJWT)
function requireAdmin(req, res, next) {
    if (!req.auth || req.auth.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
    next();
}

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
    .post(authenticateJWT, tripsController.tripsAddTrip); // POST Method Add a new trip

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) // GET Method routes tripsFindByCode
    .put(authenticateJWT, tripsController.tripsUpdateTrip) // PUT Method updates a trip
    .delete(authenticateJWT, requireAdmin, tripsController.tripsDeleteTrip); // DELETE Method soft-deletes a trip (admin only)

router
    .route('/trips/:tripCode/restore')
    .patch(authenticateJWT, requireAdmin, tripsController.tripsRestoreTrip); // PATCH Method restores a soft-deleted trip (admin only)

module.exports = router;
const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport');

const register = async (req, res) => {
    // Validate message to insure that all parameters are present
    if(!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const user = new User(
        {
            name: req.body.name,
            email: req.body.email,
            password: ''
        });
    user.setPassword(req.body.password);
    const q = await user.save();

    if(!q) {
        return res.status(400).json(err);
    }
    const token = user.generateJWT();
    res.cookie('travlr-token', token, {
        httpOnly: false,
        maxAge: 3600000,
        sameSite: 'Lax',
        path: '/'
    });
    return res.status(200).json(token);
}

const login = (req, res) => {
    // Validate message to ensure that email and password are present.
    if (!req.body.email || !req.body.password) {
        return res
        .status(400)
        .json({"message": "All fields required"});
    }

    // Delegate authentication to passport module
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            // Error in Authentication Process
            return res
            .status(404)
            .json(err);
        }
        if (user) { 
            // Auth succeeded - generate JWT and return to caller
            const token = user.generateJWT();
            res.cookie('travlr-token', token, {
                httpOnly: false,
                maxAge: 3600000,
                sameSite: 'Lax',
                path: '/'
            });
            res.status(200).json({token});
        } else {
            res.status(401).json(info);
        }
    })(req, res);
};

module.exports = {
    register,
    login
};
const mongoose = require('mongoose');
const User = require('../models/user');

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
    return res.status(200).json(token);
}

module.exports = {
    register
};
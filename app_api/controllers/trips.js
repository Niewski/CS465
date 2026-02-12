const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');

// GET: /trips - list all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    const q = await Model.find().exec();

    if (!q || q.length === 0) {
        return res.status(404).json(err);
    } else {
        return res.status(200).json(q);
    }
};

// GET: /trips/:tripCode - lists a single trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async (req, res) => {
    const q = await Model.findOne({ 'code': req.params.tripCode }).exec();

    if (!q) {
        return res.status(404).json(err);
    } else {
        return res.status(200).json(q);
    }
};

// Post: /trips - adds a new trip to the database
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async (req, res) => {
    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

    const q = await newTrip.save().catch((err) => {
        return res.status(400).json(err);
    });

    return res.status(201).json(q);
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip
};
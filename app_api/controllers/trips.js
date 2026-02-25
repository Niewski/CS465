const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');

// GET: /trips - list all the trips
// Supports query params: ?category=Beaches&search=reef&includeDeleted=true
const tripsList = async (req, res) => {
    try {
        const filter = {};

        // By default, hide soft-deleted trips
        if (req.query.includeDeleted !== 'true') {
            filter.deletedAt = null;
        }

        // Filter by category if provided
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Search by name or resort if provided
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            filter.$or = [
                { name: searchRegex },
                { resort: searchRegex }
            ];
        }

        const q = await Model.find(filter).exec();

        if (!q || q.length === 0) {
            return res.status(404).json({ message: 'No trips found' });
        } else {
            return res.status(200).json(q);
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET: /trips/:tripCode - lists a single trip
const tripsFindByCode = async (req, res) => {
    try {
        const q = await Model.findOne({ 'code': req.params.tripCode }).exec();

        if (!q) {
            return res.status(404).json({ message: 'Trip not found' });
        } else {
            return res.status(200).json(q);
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// POST: /trips - adds a new trip to the database
const tripsAddTrip = async (req, res) => {
    try {
        const newTrip = new Trip({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description,
            category: req.body.category
        });

        const q = await newTrip.save();
        return res.status(201).json(q);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// PUT: /trips/:tripCode - Updates an existing Trip
const tripsUpdateTrip = async (req, res) => {
    try {
        console.log(req.params);
        console.log(req.body);
        const q = await Model
            .findOneAndUpdate(
                { 'code': req.params.tripCode },
                {
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description,
                    category: req.body.category
                },
                { new: true }
            )
            .exec();

        if (!q) {
            return res.status(400).json({ message: 'Trip not found' });
        } else {
            return res.status(201).json(q);
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// DELETE: /trips/:tripCode - Soft delete (sets deletedAt timestamp)
const tripsDeleteTrip = async (req, res) => {
    try {
        const q = await Model
            .findOneAndUpdate(
                { 'code': req.params.tripCode },
                { deletedAt: new Date() },
                { new: true }
            )
            .exec();

        if (!q) {
            return res.status(404).json({ message: 'Trip not found' });
        } else {
            return res.status(200).json({ message: 'Trip deleted', trip: q });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// PATCH: /trips/:tripCode/restore - Restore a soft-deleted trip
const tripsRestoreTrip = async (req, res) => {
    try {
        const q = await Model
            .findOneAndUpdate(
                { 'code': req.params.tripCode },
                { deletedAt: null },
                { new: true }
            )
            .exec();

        if (!q) {
            return res.status(404).json({ message: 'Trip not found' });
        } else {
            return res.status(200).json({ message: 'Trip restored', trip: q });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip,
    tripsRestoreTrip
};
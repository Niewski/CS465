const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    code: { type: String, required: true, index: true },
    name: { type: String, required: true, index: true },
    length: { type: String, required: true },
    start: { type: Date, required: true },
    resort: { type: String, required: true },
    perPerson: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Beaches', 'Cruises', 'Mountains'], required: true },
    deletedAt: { type: Date, default: null }
});

const Trip = mongoose.model('trips', tripSchema);
module.exports = Trip;
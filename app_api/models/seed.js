// Bring in the DB connection and the Trip schema
const mongoose = require('./db');
const Trip = require('./travlr');
const User = require('./user');

// Read seed data from json file
var fs = require('fs');
var trips = JSON.parse(fs.readFileSync('data/trips.json', 'utf8'));

// delete any existing records, then insert seed data
const seedDB = async () => {
    await Trip.deleteMany({});
    await Trip.insertMany(trips);
    console.log("Trips seeded!");

    // Seed users
    await User.deleteMany({});

    // Create admin user
    const adminUser = new User({
        name: 'Admin User',
        email: 'admin@travlr.com',
        role: 'admin'
    });
    adminUser.setPassword('admin123');
    await adminUser.save();
    console.log("Admin user seeded: admin@travlr.com / admin123");

    // Create regular user
    const regularUser = new User({
        name: 'Regular User',
        email: 'user@travlr.com',
        role: 'user'
    });
    regularUser.setPassword('user123');
    await regularUser.save();
    console.log("Regular user seeded: user@travlr.com / user123");

    console.log("Database seeded!");
};

seedDB().then(() => {
    mongoose.connection.close();
    process.exit(0);
});
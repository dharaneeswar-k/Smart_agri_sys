const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Market = require('../models/Market');
const Warehouse = require('../models/Warehouse');
const Listing = require('../models/Listing');
const Transaction = require('../models/Transaction');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(`DB Connection Error: ${err.message}`);
        process.exit(1);
    }
};

const seedEssentialData = async () => {
    console.log('--- STARTING ESSENTIAL SEED ---');
    await connectDB();

    try {
        // Clear OLD Data (Except Live Prices)
        console.log('Clearing Users, Listings, Transactions, Warehouses...');
        await User.deleteMany();
        await Listing.deleteMany();
        await Transaction.deleteMany();
        await Warehouse.deleteMany();

        // Ensure Markets Exist (Required for Prices)
        console.log('Checking/Creating Markets...');
        const markets = [
            { name: 'KR Market', location: { type: 'Point', coordinates: [77.5736, 12.9634], address: 'Bangalore' } },
            { name: 'Yeshwantpur APMC', location: { type: 'Point', coordinates: [77.5480, 13.0248], address: 'Bangalore' } },
            { name: 'Kolar Market', location: { type: 'Point', coordinates: [78.1291, 13.1362], address: 'Kolar' } }
        ];

        for (const m of markets) {
            const exists = await Market.findOne({ name: m.name });
            if (!exists) {
                await Market.create(m);
                console.log(`Created Market: ${m.name}`);
            }
        }

        // Create Users
        console.log('Creating Essential Users...');
        const users = [
            {
                name: 'Ramesh Farmer',
                email: 'farmer@example.com',
                password: 'password123',
                role: 'farmer',
                location: { type: 'Point', coordinates: [77.5946, 12.9716], address: 'Bangalore Rural' },
                phone: '9876543210'
            },
            {
                name: 'Suresh Buyer',
                email: 'buyer@example.com',
                password: 'password123',
                role: 'buyer',
                location: { type: 'Point', coordinates: [77.6412, 12.9719], address: 'Indiranagar, Bangalore' },
                phone: '9876500000'
            },
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
                location: { type: 'Point', coordinates: [77.5946, 12.9716], address: 'Admin Office' },
                phone: '9999999999'
            }
        ];

        const createdUsers = await User.create(users);
        const farmer = createdUsers.find(u => u.role === 'farmer');
        const buyer = createdUsers.find(u => u.role === 'buyer');
        console.log(`Users Created: ${createdUsers.length}`);

        // Create Warehouses
        console.log('Creating Warehouses...');
        await Warehouse.create([
            {
                name: 'Central Cold Storage',
                location: { type: 'Point', coordinates: [77.4987, 12.9226], address: 'Bangalore' },
                capacity: 1000,
                pricePerDay: 50,
                contact: '080-12345678'
            }
        ]);

        // Create Listings
        console.log('Creating Sample Listings...');
        const listings = await Listing.create([
            {
                farmer: farmer._id,
                cropName: 'Tomato',
                variety: 'Hybrid',
                quantity: 50,
                pricePerKg: 12,
                location: { type: 'Point', coordinates: [77.5946, 12.9716], address: 'Bangalore Rural' },
                description: 'Fresh hybrid tomatoes directly from farm.',
                status: 'active'
            },
            {
                farmer: farmer._id,
                cropName: 'Potato',
                variety: 'Jyoti',
                quantity: 100,
                pricePerKg: 15,
                location: { type: 'Point', coordinates: [77.5946, 12.9716], address: 'Bangalore Rural' },
                description: 'High quality Jyoti potatoes.',
                status: 'active'
            }
        ]);
        console.log(`Listings Created: ${listings.length}`);

        // Create Transactions
        console.log('Creating Sample Order History...');
        await Transaction.create([
            {
                buyer: buyer._id,
                listing: listings[0]._id,
                seller: farmer._id,
                amount: 12000,
                status: 'completed'
            }
        ]);
        console.log('Transactions Created');

        console.log('--- SEED COMPLETE ---');
        process.exit();

    } catch (error) {
        console.error(`SEED ERROR: ${error}`);
        process.exit(1);
    }
};

seedEssentialData();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Market = require('../models/Market');
const Warehouse = require('../models/Warehouse');
const CropPrice = require('../models/CropPrice');
const Listing = require('../models/Listing');
const Transaction = require('../models/Transaction');
dotenv.config({ path: path.join(__dirname, '../../.env') });
const logFile = path.join(__dirname, '../../seed_log.txt');
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};
const connectDB = async () => {
    try {
        log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        log('MongoDB Connected');
    } catch (err) {
        log(`DB Connection Error: ${err}`);
        process.exit(1);
    }
};
const seedData = async () => {
    fs.writeFileSync(logFile, 'Starting Seed...\n');
    await connectDB();
    try {
        log('Clearing old data...');
        await User.deleteMany();
        await Market.deleteMany();
        await Warehouse.deleteMany();
        await CropPrice.deleteMany();
        await Listing.deleteMany();
        await Transaction.deleteMany();
        log('Data Cleared');
        log('Creating Users...');
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
            },
            {
                name: 'Mahesh Farmer',
                email: 'farmer2@example.com',
                password: 'password123',
                role: 'farmer',
                location: { type: 'Point', coordinates: [77.5, 12.9], address: 'Kolar' },
                phone: '9876543211'
            },
            {
                name: 'Anita Buyer',
                email: 'buyer2@example.com',
                password: 'password123',
                role: 'buyer',
                location: { type: 'Point', coordinates: [77.6, 13.0], address: 'Hebbal, Bangalore' },
                phone: '9876500001'
            }
        ];
        const createdUsers = await User.create(users);
        const farmer1 = createdUsers[0];
        const buyer1 = createdUsers[1];
        const farmer2 = createdUsers[3];
        const buyer2 = createdUsers[4];
        log(`Users Created: ${createdUsers.length}`);
        log('Creating Markets...');
        const markets = [
            {
                name: 'KR Market',
                location: { type: 'Point', coordinates: [77.5736, 12.9634] },
                state: 'Karnataka',
                district: 'Bangalore Urban'
            },
            {
                name: 'Yeshwantpur APMC',
                location: { type: 'Point', coordinates: [77.5480, 13.0248] },
                state: 'Karnataka',
                district: 'Bangalore Urban'
            },
            {
                name: 'Kolar Market',
                location: { type: 'Point', coordinates: [78.1291, 13.1362] },
                state: 'Karnataka',
                district: 'Kolar'
            }
        ];
        const createdMarkets = await Market.create(markets);
        log(`Markets Created: ${createdMarkets.length}`);
        log('Creating Warehouses...');
        const warehouses = [
            {
                name: 'Central Cold Storage',
                location: { type: 'Point', coordinates: [77.4987, 12.9226] },
                capacity: 1000,
                pricePerDay: 50,
                contact: '080-12345678'
            },
            {
                name: 'East Agro Warehouse',
                location: { type: 'Point', coordinates: [77.7123, 13.0012] },
                capacity: 500,
                pricePerDay: 40,
                contact: '080-87654321'
            }
        ];
        await Warehouse.create(warehouses);
        log('Warehouses Created');
        log('Skipping Dummy Prices (User requested live data only)...');
        log('Creating Listings...');
        const listings = [
            {
                farmer: farmer1._id,
                cropName: 'Tomato',
                variety: 'Hybrid',
                quantity: 50,
                pricePerKg: 12,
                location: { address: 'Bangalore Rural', coordinates: [77.5946, 12.9716] },
                status: 'active'
            },
            {
                farmer: farmer1._id,
                cropName: 'Potato',
                variety: 'Jyoti',
                quantity: 100,
                pricePerKg: 15,
                location: { address: 'Bangalore Rural', coordinates: [77.5946, 12.9716] },
                status: 'active'
            },
            {
                farmer: farmer2._id,
                cropName: 'Onion',
                variety: 'Red',
                quantity: 200,
                pricePerKg: 18,
                location: { address: 'Kolar', coordinates: [77.5, 12.9] },
                status: 'active'
            },
            {
                farmer: farmer2._id,
                cropName: 'Rice',
                variety: 'Sona Masuri',
                quantity: 500,
                pricePerKg: 25,
                location: { address: 'Kolar', coordinates: [77.5, 12.9] },
                status: 'sold'
            }
        ];
        const createdListings = await Listing.create(listings);
        log(`Listings Created: ${createdListings.length}`);
        log('Creating Transactions...');
        const transactions = [
            {
                buyer: buyer1._id,
                seller: farmer2._id,
                listing: createdListings[3]._id, 
                quantity: 50,
                pricePerKg: 25,
                amount: 50 * 25 * 100, 
                status: 'completed'
            },
            {
                buyer: buyer1._id,
                seller: farmer1._id,
                listing: createdListings[0]._id, 
                quantity: 10,
                pricePerKg: 12,
                amount: 10 * 12 * 100, 
                status: 'completed'
            }
        ];
        await Transaction.create(transactions);
        log('Transactions Created');
        log('Data Imported - DONE');
        process.exit();
    } catch (error) {
        log(`SEED ERROR: ${error}`);
        console.error(error);
        process.exit(1);
    }
};
seedData();

const mongoose = require('mongoose');
const User = require('./src/models/User');
const Listing = require('./src/models/Listing');
const Transaction = require('./src/models/Transaction');
const dotenv = require('dotenv');
dotenv.config();
const seedDashboard = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        const user = await User.findOne({ name: 'DHARANEESWAR K' });
        if (!user) {
            console.log('User DHARANEESWAR K not found. Please register/login first.');
            process.exit(1);
        }
        console.log(`Seeding data for ${user.name} (${user._id})...`);
        await Listing.deleteMany({ farmer: user._id }); 
        const listings = [
            {
                farmer: user._id,
                cropName: 'Basmati Rice',
                quantity: 50,
                pricePerKg: 45,
                status: 'active',
                description: 'Premium quality Basmati rice from Punjab.',
                location: { address: 'Punjab, India' }
            },
            {
                farmer: user._id,
                cropName: 'Organic Wheat',
                quantity: 30,
                pricePerKg: 22,
                status: 'active',
                description: 'Organically grown wheat, pesticide free.',
                location: { address: 'Haryana, India' }
            },
            {
                farmer: user._id,
                cropName: 'Yellow Maize',
                quantity: 100,
                pricePerKg: 18,
                status: 'active',
                description: 'High starch maize for industrial use.',
                location: { address: 'Karnataka, India' }
            }
        ];
        await Listing.insertMany(listings);
        console.log('Added 3 Active Listings');
        await Transaction.deleteMany({ seller: user._id }); 
        let buyer = await User.findOne({ email: 'buyer@test.com' });
        if (!buyer) {
            buyer = await User.create({
                name: 'Test Buyer',
                email: 'buyer@test.com',
                password: 'password123',
                role: 'buyer'
            });
        }
        const soldListing = await Listing.create({
            farmer: user._id,
            cropName: 'Sold Tomatoes',
            quantity: 10,
            pricePerKg: 15,
            status: 'sold',
            description: 'Sold out batch.',
            location: { address: 'Local Market' }
        });
        const wheatListing = await Listing.create({
            farmer: user._id,
            cropName: 'Organic Wheat',
            quantity: 20,
            pricePerKg: 22.5,
            status: 'sold',
            description: 'Sold to Test Buyer',
            location: { address: 'Warehouse 2' }
        });
        const transactions = [
            {
                buyer: buyer._id,
                seller: user._id,
                listing: soldListing._id,
                amount: 15000, 
                status: 'completed',
                transactionId: 'TXN_' + Date.now()
            },
            {
                buyer: buyer._id,
                seller: user._id,
                listing: wheatListing._id, 
                amount: 45000, 
                status: 'completed',
                transactionId: 'TXN_WHEAT_' + Date.now()
            }
        ];
        await Transaction.insertMany(transactions);
        console.log('Added 2 Completed Transactions (Total Revenue: 40000)');
    } catch (error) {
        console.error('Error seeding:', error);
    } finally {
        mongoose.disconnect();
        console.log('Done.');
    }
};
seedDashboard();

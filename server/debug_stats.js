const mongoose = require('mongoose');
const User = require('./src/models/User');
const Listing = require('./src/models/Listing');
const Transaction = require('./src/models/Transaction');
const dotenv = require('dotenv');
dotenv.config();
const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        const user = await User.findOne({ name: 'DHARANEESWAR K' });
        if (!user) {
            console.log('User DHARANEESWAR K not found');
            return;
        }
        console.log('Found User:', user._id, user.name);
        const listings = await Listing.find({ farmer: user._id });
        console.log(`Found ${listings.length} listings for user.`);
        listings.forEach(l => console.log(`- Listing: ${l.cropName}, Status: ${l.status}`));
        const transactions = await Transaction.find({ seller: user._id });
        console.log(`Found ${transactions.length} transactions for user.`);
        transactions.forEach(t => console.log(`- Transaction: ${t.amount}, Status: ${t.status}`));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.disconnect();
    }
};
checkData();

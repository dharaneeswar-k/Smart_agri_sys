const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Listing = require('../models/Listing');
dotenv.config({ path: path.join(__dirname, '../../.env') });
const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const activeListings = await Listing.countDocuments({ status: 'active' });
        const allListings = await Listing.countDocuments();
        const output = `All Listings: ${allListings}\nActive Listings: ${activeListings}`;
        fs.writeFileSync(path.join(__dirname, '../../verify_output.txt'), output);
        console.log(output);
        process.exit();
    } catch (error) {
        fs.writeFileSync(path.join(__dirname, '../../verify_error.txt'), error.toString());
        console.error(error);
        process.exit(1);
    }
};
verify();

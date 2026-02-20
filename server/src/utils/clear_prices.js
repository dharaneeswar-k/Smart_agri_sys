const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const CropPrice = require('../models/CropPrice');
dotenv.config({ path: path.join(__dirname, '../../.env') });
const clearPrices = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
        console.log('Clearing all Crop Prices...');
        const result = await CropPrice.deleteMany({});
        console.log(`Deleted ${result.deletedCount} price records.`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
clearPrices();

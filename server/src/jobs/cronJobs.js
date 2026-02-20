const cron = require('node-cron');
const CropPrice = require('../models/CropPrice');
const Market = require('../models/Market');
const updatePrices = cron.schedule('0 0 * * *', async () => {
    console.log('Running Cron Job: Updating Market Prices...');
    try {
        const markets = await Market.find({});
        const crops = ['Wheat', 'Rice', 'Tomato', 'Potato', 'Onion'];
        for (const market of markets) {
            for (const crop of crops) {
                const basePrice = Math.floor(Math.random() * 2000) + 1000;
                await CropPrice.create({
                    market: market._id,
                    cropName: crop,
                    variety: 'Regular',
                    pricePerQuintal: basePrice,
                    date: new Date()
                });
            }
        }
        console.log('Prices updated successfully');
    } catch (error) {
        console.error('Error updating prices:', error);
    }
});
module.exports = updatePrices;

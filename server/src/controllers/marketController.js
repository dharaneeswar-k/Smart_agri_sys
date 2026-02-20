const Market = require('../models/Market');
const asyncHandler = require('express-async-handler');
const getMarkets = asyncHandler(async (req, res) => {
    const markets = await Market.find({});
    res.json(markets);
});
const createMarket = asyncHandler(async (req, res) => {
    const { name, location, state, district } = req.body;
    const market = new Market({
        name,
        location,
        state,
        district
    });
    const createdMarket = await market.save();
    res.status(201).json(createdMarket);
});
const getNearbyMarkets = asyncHandler(async (req, res) => {
    const { lat, lng, dist } = req.query;
    const distanceInMeters = dist ? parseInt(dist) : 50000; 
    const markets = await Market.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: distanceInMeters
            }
        }
    });
    res.json(markets);
});
module.exports = { getMarkets, createMarket, getNearbyMarkets };

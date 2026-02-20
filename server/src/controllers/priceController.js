const CropPrice = require('../models/CropPrice');
const asyncHandler = require('express-async-handler');
const getPrices = asyncHandler(async (req, res) => {
    const { marketId, cropName } = req.query;
    let query = {};
    if (marketId) query.market = marketId;
    if (cropName) query.cropName = cropName;
    const prices = await CropPrice.find(query).sort({ date: -1 }).populate('market', 'name').limit(200);
    res.json(prices);
});
const addPrice = asyncHandler(async (req, res) => {
    const { marketId, cropName, variety, pricePerKg } = req.body;
    const price = new CropPrice({
        market: marketId,
        cropName,
        variety,
        pricePerKg
    });
    const createdPrice = await price.save();
    res.status(201).json(createdPrice);
});
const MarketDataService = require('../services/marketDataService');
const getPriceHistory = asyncHandler(async (req, res) => {
    const { marketId, cropName } = req.params;
    const history = await CropPrice.find({ market: marketId, cropName })
        .sort({ date: 1 })
        .select('pricePerKg date');
    res.json(history);
});
const syncPrices = asyncHandler(async (req, res) => {
    const result = await MarketDataService.syncDatabase();
    res.json(result);
});
module.exports = { getPrices, addPrice, getPriceHistory, syncPrices };

const { predictPrice, getSmartRecommendation, forecastDemand } = require('../services/aiService');
const CropPrice = require('../models/CropPrice');
const asyncHandler = require('express-async-handler');
const getPricePrediction = asyncHandler(async (req, res) => {
    const { cropName, marketId, currentPrice } = req.body;
    const prediction = predictPrice(currentPrice, cropName, []);
    res.json(prediction);
});
const getSellRecommendation = asyncHandler(async (req, res) => {
    const { currentPrice, transportCost, storageCost, cropName } = req.body;
    const prediction = predictPrice(currentPrice, cropName, []);
    const recommendation = getSmartRecommendation(
        currentPrice,
        prediction.predictedPriceNextWeek,
        transportCost || 50,
        storageCost || 20
    );
    res.json({
        ...recommendation,
        prediction
    });
});
const calculateProfit = asyncHandler(async (req, res) => {
    const { yieldQty, pricePerQuintal, laborCost, transportCost, otherCost } = req.body;
    const totalRevenue = yieldQty * pricePerQuintal;
    const totalCost = laborCost + transportCost + otherCost;
    const netProfit = totalRevenue - totalCost;
    res.json({
        totalRevenue,
        totalCost,
        netProfit,
        profitMargin: ((netProfit / totalRevenue) * 100).toFixed(2) + '%'
    });
});
const getDemandForecast = asyncHandler(async (req, res) => {
    const { cropName } = req.query;
    const forecast = forecastDemand(cropName);
    res.json(forecast);
});
module.exports = { getPricePrediction, getSellRecommendation, calculateProfit, getDemandForecast };

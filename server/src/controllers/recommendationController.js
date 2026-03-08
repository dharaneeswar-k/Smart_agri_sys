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
        storageCost || 20,
        cropName
    );
    res.json({
        ...recommendation,
        prediction,
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
const { spawn } = require('child_process');
const path = require('path');

const getDemandForecast = asyncHandler(async (req, res) => {
    const { cropName } = req.query;
    const forecast = forecastDemand(cropName);
    res.json(forecast);
});

const getCropRecommendation = asyncHandler(async (req, res) => {
    const { n, p, k, temperature, humidity, ph, rainfall } = req.body;

    const pythonProcess = spawn('py', [
        path.join(__dirname, '../ml/crop_model.py'),
        n || 0,
        p || 0,
        k || 0,
        temperature || 25,
        humidity || 50,
        ph || 6.5,
        rainfall || 100
    ]);

    let dataString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: 'Internal Server Error in ML Model' });
        }
        try {
            const result = JSON.parse(dataString);
            res.json(result);
        } catch (e) {
            res.status(500).json({ error: 'Failed to parse ML response' });
        }
    });
});

module.exports = { getPricePrediction, getSellRecommendation, calculateProfit, getDemandForecast, getCropRecommendation };

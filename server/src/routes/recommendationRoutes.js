const express = require('express');
const router = express.Router();
const { getPricePrediction, getSellRecommendation, calculateProfit, getDemandForecast } = require('../controllers/recommendationController');
const { protect } = require('../middlewares/authMiddleware');
router.post('/predict', protect, getPricePrediction);
router.post('/smart-sell', protect, getSellRecommendation);
router.post('/profit-calculator', protect, calculateProfit);
router.get('/demand-forecast', protect, getDemandForecast);
module.exports = router;

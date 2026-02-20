const express = require('express');
const router = express.Router();
const { getPrices, addPrice, getPriceHistory } = require('../controllers/priceController');
const { protect, authorize } = require('../middlewares/authMiddleware');
router.get('/', getPrices);
router.get('/history/:marketId/:cropName', getPriceHistory);
router.post('/sync', protect, authorize('admin'), require('../controllers/priceController').syncPrices); 
router.post('/', protect, authorize('admin'), addPrice);
module.exports = router;

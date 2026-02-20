const express = require('express');
const router = express.Router();
const { getMarkets, createMarket, getNearbyMarkets } = require('../controllers/marketController');
const { protect, authorize } = require('../middlewares/authMiddleware');
router.get('/', getMarkets);
router.get('/nearby', getNearbyMarkets);
router.post('/', protect, authorize('admin'), createMarket);
module.exports = router;

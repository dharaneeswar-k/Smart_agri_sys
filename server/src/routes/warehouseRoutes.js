const express = require('express');
const router = express.Router();
const { getWarehouses, getNearbyWarehouses, addWarehouse } = require('../controllers/warehouseController');
const { protect, authorize } = require('../middlewares/authMiddleware');
router.get('/', getWarehouses);
router.get('/nearby', getNearbyWarehouses);
router.post('/', protect, authorize('admin'), addWarehouse);
module.exports = router;

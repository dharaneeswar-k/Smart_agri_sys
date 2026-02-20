const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middlewares/authMiddleware');
router.get('/my-orders', protect, async (req, res) => {
    try {
        const orders = await Transaction.find({ buyer: req.user._id })
            .populate('listing')
            .populate('seller', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
module.exports = router;

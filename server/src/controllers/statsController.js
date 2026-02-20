const asyncHandler = require('express-async-handler');
const Listing = require('../models/Listing');
const Transaction = require('../models/Transaction');
const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const activeListingsCount = await Listing.countDocuments({
        farmer: userId,
        status: 'active'
    });
    const revenueResult = await Transaction.aggregate([
        {
            $match: {
                seller: userId,
                status: 'completed'
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$amount' }
            }
        }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    const recentSales = await Transaction.find({ seller: userId, status: 'completed' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('buyer', 'name email')
        .populate('listing', 'cropName');
    res.json({
        activeListings: activeListingsCount,
        totalRevenue,
        recentSales
    });
});
module.exports = {
    getDashboardStats
};

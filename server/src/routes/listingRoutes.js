const express = require('express');
const router = express.Router();
const {
    getListings,
    createListing,
    getMyListings,
    buyListing,
    updateListing,
    deleteListing,
} = require('../controllers/listingController');
const { protect, authorize } = require('../middlewares/authMiddleware');
router.get('/', getListings);
router.post('/', protect, authorize('farmer', 'admin'), createListing);
router.get('/my', protect, getMyListings);
router.post('/:id/buy', protect, authorize('buyer'), buyListing);
router.put('/:id', protect, authorize('farmer', 'admin'), updateListing);
router.delete('/:id', protect, authorize('farmer', 'admin'), deleteListing);
module.exports = router;

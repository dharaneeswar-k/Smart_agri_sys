const Listing = require('../models/Listing');
const Transaction = require('../models/Transaction');
const asyncHandler = require('express-async-handler');
const getListings = asyncHandler(async (req, res) => {
    const listings = await Listing.find({ status: 'active' }).populate('farmer', 'name location');
    res.json(listings);
});
const createListing = asyncHandler(async (req, res) => {
    const { cropName, variety, quantity, pricePerKg, description, location } = req.body;
    const listing = new Listing({
        farmer: req.user._id,
        cropName,
        variety,
        quantity,
        pricePerKg,
        description,
        location: location || req.user.location
    });
    const createdListing = await listing.save();
    const io = req.app.get('io');
    io.emit('new_listing', createdListing);
    res.status(201).json(createdListing);
});
const getMyListings = asyncHandler(async (req, res) => {
    const listings = await Listing.find({ farmer: req.user._id });
    res.json(listings);
});
const buyListing = asyncHandler(async (req, res) => {
    const listingId = req.params.id;
    const { amount } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) {
        res.status(404);
        throw new Error('Listing not found');
    }
    if (listing.status !== 'active') {
        res.status(400);
        throw new Error('Listing is not available');
    }
    const transaction = new Transaction({
        buyer: req.user._id,
        listing: listingId,
        seller: listing.farmer,
        amount,
        status: 'completed' 
    });
    await transaction.save();
    listing.status = 'sold';
    await listing.save();
    res.status(201).json(transaction);
});
const updateListing = asyncHandler(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        res.status(404);
        throw new Error('Listing not found');
    }
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }
    if (listing.farmer.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(200).json(updatedListing);
});
const deleteListing = asyncHandler(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        res.status(404);
        throw new Error('Listing not found');
    }
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }
    if (listing.farmer.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }
    await listing.deleteOne();
    res.status(200).json({ id: req.params.id });
});
module.exports = {
    getListings,
    createListing,
    getMyListings,
    buyListing,
    updateListing,
    deleteListing,
};

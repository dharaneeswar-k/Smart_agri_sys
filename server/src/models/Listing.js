const mongoose = require('mongoose');
const listingSchema = mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cropName: {
        type: String,
        required: true
    },
    variety: String,
    quantity: {
        type: Number,
        required: true 
    },
    pricePerKg: {
        type: Number,
        required: true
    },
    description: String,
    images: [String],
    status: {
        type: String,
        enum: ['active', 'sold', 'expired'],
        default: 'active'
    },
    location: {
        address: String,
        coordinates: [Number]
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Listing', listingSchema);

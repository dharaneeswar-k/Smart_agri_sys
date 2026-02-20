const mongoose = require('mongoose');
const cropPriceSchema = mongoose.Schema({
    market: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Market',
        required: true
    },
    cropName: {
        type: String,
        required: true
    },
    variety: String,
    pricePerKg: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('CropPrice', cropPriceSchema);

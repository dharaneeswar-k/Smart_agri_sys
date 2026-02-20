const mongoose = require('mongoose');
const warehouseSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
        address: String
    },
    capacity: {
        type: Number, 
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    contact: String
}, {
    timestamps: true
});
warehouseSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Warehouse', warehouseSchema);

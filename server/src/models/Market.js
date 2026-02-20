const mongoose = require('mongoose');
const marketSchema = mongoose.Schema({
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
    state: String,
    district: String
}, {
    timestamps: true
});
marketSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Market', marketSchema);

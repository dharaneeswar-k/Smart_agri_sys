const mongoose = require('mongoose');
const notificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['alert', 'info', 'transaction'],
        default: 'info'
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Notification', notificationSchema);

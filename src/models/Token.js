const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    originalValue: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['name', 'email', 'phone']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d' // Tokens will be automatically deleted after 30 days
    }
});

module.exports = mongoose.model('Token', tokenSchema); 
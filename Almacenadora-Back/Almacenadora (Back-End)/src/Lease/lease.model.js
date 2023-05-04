'use strict'

const mongoose = require('mongoose');

const leaseSchema = mongoose.Schema({
    cellar: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Cellar',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Client',
        required: true
    },
    services: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Additional',
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Lease', leaseSchema);
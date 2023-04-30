'use strict'

const mongoose = require('mongoose');

const cellarModel = mongoose.Schema({
    image: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    location: {
        type: String
    },
    size: {
        type: String
    },
    availability: {
        type: String
    },
    price: {
        type: Number
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Cellar', cellarModel);
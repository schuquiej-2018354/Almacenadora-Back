'use strict'

const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    surname:{
        type: String,
        required: true
    },
    identification:{
        type: String,
        required: true
    },
    residency:{
        type: String,
        required: true
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Client', clientSchema);
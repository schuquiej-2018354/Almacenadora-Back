'use strict'

const mongoose = require('mongoose');

const additionalSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true,
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Additional', additionalSchema);
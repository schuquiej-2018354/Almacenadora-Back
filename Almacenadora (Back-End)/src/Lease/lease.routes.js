'use strict'

const express = require('express');
const leasecontroller = require('./lease.controller')
const api = express.Router();

api.get('/', leasecontroller.test);
api.post('/add', leasecontroller.add);
api.put('/update/:id', leasecontroller.update);
api.delete('/delete/:id', leasecontroller.delete);
api.get('/get', leasecontroller.get);
api.post('/getByCellarAndClient', leasecontroller.getByCellarAndClient);


module.exports = api;
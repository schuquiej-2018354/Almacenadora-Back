const express = require('express');
const api = express.Router();
const additionalController = require('./additional.controller');

api.get('/', additionalController.test);
api.post('/addAdditional', additionalController.addAdditional);
api.put('/updateAdditional/:id', additionalController.updateAdditional);
api.get('/getAdditional', additionalController.getAdditional);

module.exports = api;
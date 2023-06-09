'use strict'

const express = require('express');
const api = express.Router();
const clientController = require('./client.controller');

api.get('/', clientController.test);
api.post('/add', clientController.add);
api.put('/update/:id', clientController.update);
api.delete('/delete/:id', clientController.delete);
api.get('/get', clientController.get);
api.post('/getByIdentification', clientController.getByIdentification);
api.get('/getById/:id', clientController.getById);

module.exports = api;
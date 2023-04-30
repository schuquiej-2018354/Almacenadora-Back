const express = require('express');
const api = express.Router();
const accountsController = require('./accounts.controller');

api.get('/', accountsController.test);
api.post('/addAccount', accountsController.addAccount);
api.put('/updateAccount/:id', accountsController.updateAccount);
api.delete('/deleteAccount/:id', accountsController.deleteAccount);
api.get('/getAccounts', accountsController.getAccounts);

module.exports = api;
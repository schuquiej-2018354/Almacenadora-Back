const express = require('express');
const api = express.Router();
const cellarController = require('./cellars.controller');
/* const multiparty = require('connect-multiparty') */
/* const upload = multiparty({ uploadDir: './upload/cellar' }) */

api.get('/', cellarController.test);
api.post('/add', cellarController.Add);
api.put('/update/:id', cellarController.update);
api.delete('/delete/:id', cellarController.delete);
api.get('/getCellars', cellarController.getCellars);
api.get('/getByLocation', cellarController.getByLocation);
api.get('/getByPrice', cellarController.getByPrice);
api.get('/getById/:id', cellarController.getById);
/* api.put('/upload-image/:id', upload, cellarController.uploadImage) */

module.exports = api;
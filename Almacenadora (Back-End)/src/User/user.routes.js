'use strict'

const userController = require('./user.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');
const express = require('express');
const api = express.Router();


api.get('/test', userController.test);
api.get('/getById/:id', userController.getById);
api.get('/getUsers', userController.getUsers);

module.exports = api;
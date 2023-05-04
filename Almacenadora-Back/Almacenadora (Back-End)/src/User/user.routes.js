'use strict'

const userController = require('./user.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');
const express = require('express');
const api = express.Router();


api.get('/test', userController.test);
api.post('/login', userController.login)

module.exports = api;
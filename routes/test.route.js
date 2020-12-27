const express = require('express');
const routes = express.Router();

const testController = require('../controllers/test.controller.js');

routes.get('/test', testController.test)

module.exports = routes;
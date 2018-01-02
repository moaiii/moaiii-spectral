'use strict';
const express = require('express');
const router = express.Router();
const request = require('request');

// ROUTES
var indexRoute = require('./index');
var songRoute = require('./song');

// API ENDPOINTS
router.get('/song/:id', songRoute);
router.get('/', indexRoute);

// EXPORT 
module.exports = router;
'use strict';

var devConfig = require('./development.js');
var stagConfig = require('./staging.js');
var prodConfig = require('./production.js');
if (process.env["HW_ENV"] == 'development') { module.exports = devConfig; }
else if (process.env["HW_ENV"] == 'staging') { module.exports = stagConfig; }
else if (process.env["HW_ENV"] == 'production') { module.exports = prodConfig; }
else module.exports = devConfig;

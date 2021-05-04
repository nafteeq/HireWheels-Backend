
'use strict';
const express = require('express');
const router = express.Router();
const misc = require("../api/misc")
const auth = require("../api/auth")
const vehicle = require("../api/vehicle")
const booking = require("../api/booking")
const middlewares = require("../tools/middlewares")

// Misc
router.get("/hirewheels/v1/misc/ping", misc.ping)

// Auth
router.post("/hirewheels/v1/users", auth.signUp)
router.post("/hirewheels/v1/users/access-token", auth.login)

// Admin Routes
router.post("/hirewheels/v1/vehicles", middlewares.isAdminAuthenticated, vehicle.addVehicle)
router.put("/hirewheels/v1/vehicles/:vehicleId", middlewares.isAdminAuthenticated, vehicle.updateAvailability)
router.get("/hirewheels/v1/vehicles/all", middlewares.isAdminAuthenticated, vehicle.getAllVehicles)

// User Routes
router.get("/hirewheels/v1/vehicles", vehicle.getVehicles)
router.post("/hirewheels/v1/bookings", middlewares.isUserAuthenticated, booking.bookVehicle)

module.exports = router
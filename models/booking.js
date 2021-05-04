'use strict';

const mongoose_validator = require('validator');
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const collections = require('../constants/collections');
const enums = require('../constants/enums');

const schema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        alias: 'bookingId'
    },

    // Reference
    userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref:collections.user},
    vehicleId: {type: mongoose.Schema.Types.ObjectId, required: true, ref:collections.vehicle},
    locationId: {type: mongoose.Schema.Types.ObjectId, required: true, ref:collections.location},

    // Data
    pickUpDate: {type: Date, required: true},
    dropOffDate: {type: Date, required: true},
    bookingDate: {type: Date, required: true},
    amount: {type:Number, requied:true},

    // Mandatory Columns
    createdDate: { type: Date, default: Date.now }, // Created Date
    updatedDate: { type: Date, default: Date.now }, // Updated Date
    isActive: { type: Boolean, default: true }, // On/Off Flag
    deleted: { type: Boolean, default: false }, // Soft Delete Flag
    comment: { type: String, default: null } // If any

}, { collection: collections.booking })

// Model
const BookingModel = mongoose.model(collections.booking, schema)

module.exports = { BookingModel }

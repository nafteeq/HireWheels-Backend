'use strict';

const mongoose_validator = require('validator');
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const collections = require('../constants/collections')

const schema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        alias: 'locationId'
    },

    // Data
    locationName: {type: String, required: true},
    address: {type: String, required: true},
    pincode: { type: Number, required: true },

    // Reference
    cityId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: collections.city },

    // Mandatory Columns
    createdDate: { type: Date, default: Date.now }, // Created Date
    updatedDate: { type: Date, default: Date.now }, // Updated Date
    isActive: { type: Boolean, default: true }, // On/Off Flag
    deleted: { type: Boolean, default: false }, // Soft Delete Flag
    comment: { type: String, default: null } // If any

}, { collection: collections.location })

// Model
const LocationModel = mongoose.model(collections.location, schema)

module.exports = { LocationModel }

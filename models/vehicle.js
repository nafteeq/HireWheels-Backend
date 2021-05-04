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
        alias: 'vehicleId'
    },

    // Reference
    vehicleSubCategoryId: {type: mongoose.Schema.Types.ObjectId, required: true, ref:collections.vehicleSubCategory},
    fuelTypeId: {type: mongoose.Schema.Types.ObjectId, required: true, ref:collections.fuelType},
    locationId: {type: mongoose.Schema.Types.ObjectId, required: true, ref:collections.location},

    // Data
    vehicleModel: {type: String, required: true},
    vehicleNumber: {type: String, required: true},
    color: {type: String, required: true},
    availabilityStatus: { type: Number, default: 1, enum:enums.availabilityStatus },
    carImageUrl: {type: String, required: true},

    // Mandatory Columns
    createdDate: { type: Date, default: Date.now }, // Created Date
    updatedDate: { type: Date, default: Date.now }, // Updated Date
    isActive: { type: Boolean, default: true }, // On/Off Flag
    deleted: { type: Boolean, default: false }, // Soft Delete Flag
    comment: { type: String, default: null } // If any

}, { collection: collections.vehicle })

// Model
const VehicleModel = mongoose.model(collections.vehicle, schema)

module.exports = { VehicleModel }

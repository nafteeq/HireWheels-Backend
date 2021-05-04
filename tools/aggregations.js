const mongoose = require('mongoose')
const collections = require("../constants/collections")

function getAvailableVehiclePipeline(filters, categoryName, pickUpDate, dropOffDate) {

    // Pipeline
    let pipeline = [
        {
            "$match" : filters
        },
        {
            "$lookup": { // Join Vehicle Sub Category
                "from": collections.vehicleSubCategory,
                "localField": 'vehicleSubCategoryId',
                "foreignField": '_id',
                "as": 'vehicleSubCategoryData'
            }
        },
        {
            "$unwind": "$vehicleSubCategoryData" // Unwind Data to filter Data
        },
    ]

    // Category Filter (Optional)
    if (categoryName){
        pipeline.push(
            {
                "$lookup": { // Join Vehicle Category
                    "from": collections.vehicleCategory,
                    "localField": 'vehicleSubCategoryData.vehicleCategoryId',
                    "foreignField": '_id',
                    "as": 'vehicleCategoryData'
                }
            },
            {
                "$unwind": "$vehicleCategoryData" // Unwind Data to filter Data
            },
            {
                "$match" : {"vehicleCategoryData.vehicleCategoryName": categoryName} // Filter Joined Data
            },
        )
    }

    return pipeline
}

module.exports = {
    getAvailableVehiclePipeline
}
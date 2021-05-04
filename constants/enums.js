'use strict';

const refString = require("./refStrings")

let enums = {}
enums.roleNames = [refString.user, refString.admin]
enums.availabilityStatus = [0,1]

module.exports = enums
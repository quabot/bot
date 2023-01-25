const reqString = {
    type: String,
    required: true
}

const optString = {
    type: String,
    required: false
}

const reqNum = {
    type: Number,
    required: true
}

const reqId = {
    type: Number,
    required: true,
    default: 1
}

const optId = {
    type: Number,
    default: 1,
    required: true
}

const reqBool = {
    type: Boolean,
    required: true
}

const reqObject = {
    type: Object,
    required: true
}

const reqArray = {
    type: Array,
    required: true
}

module.exports = { optString, reqArray, reqObject, reqBool, reqString, reqNum, optId };
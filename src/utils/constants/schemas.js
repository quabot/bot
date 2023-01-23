const reqString = {
    type: String,
    required: true
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

module.exports = { reqObject, reqBool, reqString, reqNum, optId };
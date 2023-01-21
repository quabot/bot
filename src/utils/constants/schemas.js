const reqString = {
    type: String,
    required: true
}

const reqNum = {
    type: Number,
    required: true
}

const optId = {
    type: Number,
    default: 0,
    required: false
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
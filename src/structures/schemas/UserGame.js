const { Schema, model } = require("mongoose");
const { reqString, reqNum } = require("../../utils/constants/schemas");

const UserGames = new Schema({
   userId: reqString,
    type: reqNum,
    quiz: reqNum
});

module.exports = model('User-Game', UserGames);

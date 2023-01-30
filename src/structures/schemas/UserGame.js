const { Schema, model } = require("mongoose");
const { reqString, reqNum } = require("../../utils/constants/schemas");

const UserGames = new Schema({
    userId: reqString,
    typePoints: reqNum,
    typeTries: reqNum,
    
    quizTries: reqNum,
    quizPoints: reqNum
});

module.exports = model('User-Game', UserGames);

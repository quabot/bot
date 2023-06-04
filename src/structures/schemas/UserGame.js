const { Schema, model } = require("mongoose");
const { reqString, reqNum, reqObject } = require("../../utils/constants/schemas");

const UserGames = new Schema({
    userId: reqString,
    typePoints: reqNum,
    typeTries: reqNum,
    typeFastest: reqNum,
    
    quizTries: reqNum,
    quizPoints: reqNum,
    
    rpsTries: reqNum,
    rpsPoints: reqNum,

    birthday: reqObject,
    bio: reqString
});

module.exports = model('User-Game', UserGames);

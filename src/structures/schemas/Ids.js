const { Schema, model } = require('mongoose');
const { reqString, optId } = require('@constants/schemas');

const IdsSchema = new Schema({
  guildId: reqString,
  suggestId: optId,
  giveawayId: optId,
  pollId: optId,
  ticketId: optId,
});

module.exports = model('Id', IdsSchema);

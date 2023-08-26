const { Schema, model } = require('mongoose');
const { reqString, reqBool } = require('@constants/schemas');

const AfkConfig = new Schema({
  guildId: reqString,
  enabled: reqBool,
});

module.exports = model('Afk-Config', AfkConfig);

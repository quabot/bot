const { Schema, model } = require('mongoose');
const { reqString, reqNum, reqBool, reqObject, reqArray } = require('@constants/schemas');

const WelcomeConfig = new Schema({
  guildId: reqString,

  joinEnabled: reqBool,
  joinChannel: reqString,
  joinType: reqString,
  joinMessage: reqObject,

  leaveEnabled: reqBool,
  leaveChannel: reqString,
  leaveType: reqString,
  leaveMessage: reqObject,

  joinRole: reqArray,
  joinRoleEnabled: reqBool,

  joinDM: reqBool,
  joinDMType: reqString,
  dm: reqObject,
});

module.exports = model('Welcome-Config', WelcomeConfig);

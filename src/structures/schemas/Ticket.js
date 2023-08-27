const { Schema, model } = require("mongoose");
const { reqString, reqBool, reqArray } = require("@constants/schemas");

const TicketSchema = new Schema({
  guildId: reqString,

  id: reqString,
  channelId: reqString,

  topic: reqString,
  closed: reqBool,

  owner: reqString,
  users: reqArray,
  staff: reqString,
});

module.exports = model("Ticket", TicketSchema);

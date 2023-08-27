const Ids = require("@schemas/Ids");

const getIdConfig = async (guildId) => {
  const idConfig = await Ids.findOne({ guildId }, (err, ids) => {
    if (err) console.log(err);
    if (!ids)
      new Ids({
        guildId,
        suggestId: 0,
        giveawayId: 0,
        pollId: 0,
        ticketId: 1,
      }).save();
  })
    .clone()
    .catch(() => {});

  return idConfig;
};

module.exports = { getIdConfig };

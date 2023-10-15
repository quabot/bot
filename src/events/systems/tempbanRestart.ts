const { Client } = require('discord.js');
const ms = require('ms');
const Punishment = require('@schemas/Punishment');
const { tempUnban } = require('@functions/unban');

module.exports = {
  event: 'ready',
  name: 'tempbanRestart',
  once: true,

  async execute({ client }: EventArgs) {
    const Punishments = await Punishment.find({
      type: 'tempban',
      active: true,
    });

    Punishments.forEach(async punishment => {
      let timeToUnban = parseInt(punishment.time) - new Date().getTime() + ms(punishment.duration);
      if (timeToUnban < 0) timeToUnban = 1;

      setTimeout(async () => {
        await tempUnban(client, punishment);
      }, timeToUnban);
    });
  },
};

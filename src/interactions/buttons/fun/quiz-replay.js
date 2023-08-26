const { Client, ButtonInteraction, ColorResolvable } = require('discord.js');
const { execute } = require('../../../commands/fun/quiz');

module.exports = {
  name: 'quiz-replay',
  /**
   * @param {Client} client
   * @param {ButtonInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await execute(client, interaction, color).catch(e => console.log(e.message));
  },
};

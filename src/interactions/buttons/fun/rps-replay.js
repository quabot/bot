const { execute } = require('@commands/fun/rps');

module.exports = {
  name: 'rps-replay',
  /**
   * @param {Client} client
   * @param {ButtonInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await execute(client, interaction, color).catch(e => console.log(e.message));
  },
};

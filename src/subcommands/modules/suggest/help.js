const { Client, ChatInputCommandInteraction } = require("discord.js");
const { Embed } = require("@constants/embed");

module.exports = {
  parent: "suggestion",
  name: "help",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply({ ephemeral: true });

    await interaction.editReply({
      embeds: [
        new Embed(color).setTitle("What are suggestions and how do i use them?")
          .setDescription(`Suggestions are a way for you to leave a suggestion that your fellow server members can vote on. Just type \`/suggestion create\` and enter your suggestion in the modal to create one. If enabled, you will be updated on the status via DMs. The full list of suggestion commands:
					\`/suggestion create\` - Create a suggestion
					\`/suggestion accept\` - Accept a suggestion (admin).
					\`/suggestion deny\` - Deny a suggestion (admin).
					\`/suggestion delete\` - Delete a suggestion (admin).
					\`/suggestion help\` - Receive help about the suggestions module.`),
      ],
    });
  },
};

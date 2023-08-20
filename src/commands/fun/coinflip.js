const { SlashCommandBuilder, Client, CommandInteraction } = require('discord.js');
const { Embed } = require('../../utils/constants/embed');

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flip a coin.')
		.setDMPermission(false),
	/**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
	async execute(client, interaction, color) {
		//* Defer the reply to give the user an instant response.
		await interaction.deferReply();

		//* Return the result of the coin flip from an array.
		const flips = ['**🪙 Heads!**', '**🪙 Tails!**'];
		await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription(flips[Math.floor(Math.random() * flips.length)])
			]
		});
	}
};
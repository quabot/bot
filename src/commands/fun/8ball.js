const { SlashCommandBuilder, Client, CommandInteraction } = require('discord.js');
const { Embed } = require('@constants/embed');


//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Ask a question to the 8ball.')
		.addStringOption(option => option
			.setName('question')
			.setDescription('What is your question?')
			.setRequired(true))
		.setDMPermission(false),
	/**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
	async execute(client, interaction, color) {
		//* Defer the reply to give the user an instant response.
		await interaction.deferReply({ ephemeral: true });

		//* Get the question from the interaction options
		const question = interaction.options.get('question').value;
		if (!question) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('Please enter a question to ask.')
			]
		});


		//* Array of possible 8ball answers.
		const answers = [
			'It is certain',
			'Without a doubt',
			'You may rely on it',
			'Yes definitely',
			'It is decidedly so',
			'As I see it, yes',
			'Most likely',
			'Yes',
			'Outlook good',
			'Signs point to yes',
			'Reply hazy try again',
			'Better not tell you now',
			'Ask again later',
			'Cannot predict now',
			'Concentrate and ask again',
			'Don\'t count on it',
			'Outlook not so good',
			'My sources say no',
			'Very doubtful',
			'My reply is no',
		];

		//* Edit the reply to give the user a random answer.
		await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription(`**${question}**\n${answers[Math.floor(Math.random() * answers.length)]}`)
			]
		});
	}
};
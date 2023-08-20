const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, Client, CommandInteraction } = require('discord.js');
const { Embed } = require('@constants/embed');
const axios = require('axios');
const { shuffleArray } = require('@functions/array');
const { getUserGame } = require('@configs/userGame');

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('quiz')
		.setDescription('Play a multiple choice quiz.')
		.setDMPermission(false),
	/**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
	async execute(client, interaction, color) {
		//* Defer the reply to give the user an instant response.
		await interaction.deferReply();

		//* Fetch a quiz question from the opentdb API, and return an error if it fails.
		const { data } = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
		if (!data) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('Failed to get a quiz question!')
			]
		});

		//* Define the question and answers.
		const question = data.results[0];
		if (!question) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('Failed to get a quiz question!')
			]
		});

		//* Shufle the answers
		const answersRaw = question.incorrect_answers;
		answersRaw.push(question.correct_answer);
		const answers = await shuffleArray(answersRaw);


		//* Create the buttons for each answer.
		const row = new ActionRowBuilder();
		answers.forEach(answer => {
			const button = new ButtonBuilder()
				.setCustomId(`${answers.indexOf(answer)}`)
				.setLabel(answer.replaceAll('&amp;', '&').replaceAll('&reg;', '®').replaceAll('&#039;', '\'').replaceAll('&quot;', '"'))
				.setStyle(ButtonStyle.Secondary);

			row.addComponents(button);
		});

		//* Edit the message to show the quiz question to the user.
		const message = await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription(`${question.question}`.replaceAll('&amp;', '&').replaceAll('&reg;', '®').replaceAll('&quot;', '"').replaceAll('&#039;', '\''))
			], components: [row], fetchReply: true
		});

		//* Create a collector to collect the interactions.
		const collector = message.createMessageComponentCollector({
			time: 60000
		});

		collector.on('collect', async i => {

			// ? The replay button is handled by the button handler.
			if (i.customId === 'quiz-replay') return;

			//* Set the user's attempts for the score
			const userDB = await getUserGame(i.user.id);
			if (userDB) userDB.quizTries += 1;

			//* Check what the user answered and update the message accordingly.
			const answeredAnswer = answers[parseInt(i.customId)];
			if (!answeredAnswer) return i.reply('There was an error.');
			if (answeredAnswer === question.correct_answer) {
				const row2 = new ActionRowBuilder();

				const button = new ButtonBuilder()
					.setCustomId('quiz-replay')
					.setLabel('Play Again')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(false);


				//* Create a disabled list of buttons
				answers.forEach(answer => {
					const buttonDis2 = new ButtonBuilder()
						.setCustomId(`${answers.indexOf(answer)}`)
						.setLabel(answer.replaceAll('&quot;', '"').replaceAll('&#039;', '\'').replaceAll('&amp;', '&').replaceAll('&reg;', '®'))
						.setStyle(answer === question.correct_answer ? ButtonStyle.Success : ButtonStyle.Secondary)
						.setDisabled(true);

					row2.addComponents(buttonDis2);
				});
				row2.addComponents(button);

				//* Display the result and give the user their points.
				await i.update({
					embeds: [
						new Embed(Colors.Green)
							.setDescription(`**Correct**\n${question.question}\n**Answered by:** ${i.user}\n**Points:** ${userDB ? userDB.quizPoints + 1 : 0}`.replaceAll('&amp;', '&').replaceAll('&reg;', '®').replaceAll('&#039;', '\'').replaceAll('&quot;', '"'))
					], components: [row2]
				});

				if (userDB) userDB.quizPoints += 1;
				if (userDB) await userDB.save();
			} else {
				const row2 = new ActionRowBuilder();

				const button = new ButtonBuilder()
					.setCustomId('quiz-replay')
					.setLabel('Play Again')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(false);

				//* Create a disabled list of buttons
				answers.forEach(answer => {
					const buttonDis = new ButtonBuilder()
						.setCustomId(`${answers.indexOf(answer)}`)
						.setLabel(answer.replaceAll('&quot;', '"').replaceAll('&amp;', '&').replaceAll('&reg;', '®').replaceAll('&#039;', '\''))
						.setStyle(answer === question.correct_answer ? ButtonStyle.Success : (answers.indexOf(answer) === parseInt(interaction.customId) ? ButtonStyle.Danger : ButtonStyle.Secondary))
						.setDisabled(true);

					row2.addComponents(buttonDis);
				});
				row2.addComponents(button);

				//* Display the result and take away the user's points.
				await i.update({
					embeds: [
						new Embed(Colors.Red)
							.setDescription(`**Incorrect**\n${question.question}\n**Correct Answer:** ${question.correct_answer}\n**Answered by:** ${interaction.user}\n**Points:** ${userDB ? userDB.quizPoints - 1 : 0}`.replaceAll('&#039;', '\'').replaceAll('&amp;', '&').replaceAll('&reg;', '®').replaceAll('&quot;', '"'))
					], components: [row2]
				});

				if (userDB) userDB.quizPoints -= 1;
				if (userDB) await userDB.save();
			}
		});
	}
};
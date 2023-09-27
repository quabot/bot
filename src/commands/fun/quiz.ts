import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, ComponentType } from 'discord.js';
import { Embed } from '@constants/embed';
import axios from 'axios';
import { shuffleArray } from '@functions/array';
import { getUserGame } from '@configs/userGame';
import type { CommandArgs } from '@typings/functionArgs';
import { replaceHtmlCharCodes } from '@functions/string';

//* Create the command and pass the SlashCommandBuilder to the handler.
export default {
  data: new SlashCommandBuilder().setName('quiz').setDescription('Play a multiple choice quiz.').setDMPermission(false),

  async execute({ interaction, color, client }: CommandArgs) {
    //* Defer the reply to give the user an instant response.
    await interaction.deferReply();

    //* Fetch a quiz question from the opentdb API, and return an error if it fails.
    const { data } = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
    if (!data)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Failed to get a quiz question!')],
      });

    //* Define the question and answers.
    const question = data.results[0] as {
      category: string;
      type: string;
      difficulty: string;
      question: string;
      correct_answer: string;
      incorrect_answers: string[];
    };
    if (!question)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Failed to get a quiz question!')],
      });

    //* Shufle the answers
    const answersRaw = question.incorrect_answers;
    answersRaw.push(question.correct_answer);
    const answers = shuffleArray(answersRaw);

    //* Create the buttons for each answer.
    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      answers.map((answer, i) => {
        return new ButtonBuilder()
          .setCustomId(`${i}`)
          .setLabel(replaceHtmlCharCodes(answer))
          .setStyle(ButtonStyle.Secondary);
      }),
    );

    //* Edit the message to show the quiz question to the user.
    const message = await interaction.editReply({
      embeds: [new Embed(color).setDescription(replaceHtmlCharCodes(question.question))],
      components: [row],
    });

    //* Create a collector to collect the interactions.
    const collector = message.createMessageComponentCollector({
      time: 60000,
      componentType: ComponentType.Button,
    });

    collector.on('collect', async i => {
      // ? The replay button is handled by the button handler.
      if (i.customId === 'quiz-replay') return;

      //* Set the user's attempts for the score
      const userDB = await getUserGame(i.user.id, client);
      if (userDB) userDB.quizTries += 1;

      //* Check what the user answered and update the message accordingly.
      const answeredAnswer = answers[parseInt(i.customId)];
      if (!answeredAnswer) {
        await i.reply('There was an error.');
        return;
      }
      if (answeredAnswer === question.correct_answer) {
        const row2 = new ActionRowBuilder<ButtonBuilder>();

        const button = new ButtonBuilder()
          .setCustomId('quiz-replay')
          .setLabel('Play Again')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(false);

        //* Create a disabled list of buttons
        answers.forEach(answer => {
          const buttonDis2 = new ButtonBuilder()
            .setCustomId(`${answers.indexOf(answer)}`)
            .setLabel(replaceHtmlCharCodes(answer))
            .setStyle(answer === question.correct_answer ? ButtonStyle.Success : ButtonStyle.Secondary)
            .setDisabled(true);

          row2.addComponents(buttonDis2);
        });
        row2.addComponents(button);

        //* Display the result and give the user their points.
        await i.update({
          embeds: [
            new Embed(Colors.Green).setDescription(
              replaceHtmlCharCodes(
                `**Correct**\n${question.question}\n**Answered by:** ${i.user}\n**Points:** ${
                  userDB ? userDB.quizPoints + 1 : 0
                }`,
              ),
            ),
          ],
          components: [row2],
        });

        if (userDB) userDB.quizPoints += 1;
        if (userDB) await userDB.save();
      } else {
        const row2 = new ActionRowBuilder<ButtonBuilder>();

        const button = new ButtonBuilder()
          .setCustomId('quiz-replay')
          .setLabel('Play Again')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(false);

        //* Create a disabled list of buttons
        answers.forEach(answer => {
          const buttonDis = new ButtonBuilder()
            .setCustomId(`${answers.indexOf(answer)}`)
            .setLabel(replaceHtmlCharCodes(answer))
            .setStyle(
              answer === question.correct_answer
                ? ButtonStyle.Success
                : answers.indexOf(answer) === parseInt(i.customId)
                ? ButtonStyle.Danger
                : ButtonStyle.Secondary,
            )
            .setDisabled(true);

          row2.addComponents(buttonDis);
        });
        row2.addComponents(button);

        //* Display the result and take away the user's points.
        await i.update({
          embeds: [
            new Embed(Colors.Red).setDescription(
              replaceHtmlCharCodes(
                `**Incorrect**\n${question.question}\n**Correct Answer:** ${
                  question.correct_answer
                }\n**Answered by:** ${interaction.user}\n**Points:** ${userDB ? userDB.quizPoints - 1 : 0}`,
              ),
            ),
          ],
          components: [row2],
        });

        if (userDB) userDB.quizPoints -= 1;
        if (userDB) await userDB.save();
      }
    });
  },
};

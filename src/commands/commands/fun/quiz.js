const { Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const axios = require('axios');
const { shuffleArray } = require('../../../structures/functions/arrays');

module.exports = {
    name: "quiz",
    description: "Play a quiz.",
    /**
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();

        const { data } = await axios.get('https://the-trivia-api.com/api/questions?limit=1&difficulty=easy');

        let answerList = data[0].incorrectAnswers;
        answerList.push(data[0].correctAnswer);

        answerList = await shuffleArray(answerList);

        let index = 1;
        const answerButtons = new ActionRowBuilder()
        const disButtons = new ActionRowBuilder()
        answerList.forEach(q => {
            let style = ButtonStyle.Primary;
            style = answerList[index - 1] === data[0].correctAnswer ? ButtonStyle.Success : ButtonStyle.Primary;
            answerButtons.addComponents(
                new ButtonBuilder()
                    .setCustomId(`${index}`)
                    .setLabel(q)
                    .setStyle(ButtonStyle.Primary)
            )
            disButtons.addComponents(
                new ButtonBuilder()
                    .setCustomId(`${index}`)
                    .setDisabled(true)
                    .setLabel(q)
                    .setStyle(style)
            )
            index++;
        });

        const message = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${data[0].question}`)
                    .setColor(color)
            ], fetchReply: true,
            components: [answerButtons]
        }).catch((e => console.log(e)));

        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 20000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return;

            await i.update({
                components: [disButtons]
            }).catch((e => { }));

            // reply w message to play again
        });

        collector.on('end', async () => {
            await message.edit({
                components: [disButtons]
            }).catch((e => { }));
        });
    }
}
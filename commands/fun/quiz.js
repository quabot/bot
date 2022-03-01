const { MessageActionRow, MessageButton } = require("discord.js");

const colors = require('../../files/colors.json');
const quiz = require('../../files/quiz.json');
const { empty } = require("../../embeds/fun");
const { error } = require("../../embeds/general");

module.exports = {
    name: "quiz",
    description: "Play a nice quiz.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        try {
            const item = quiz[Math.floor(Math.random() * quiz.length)];
            if (!item) return interaction.reply({ ephemeral: true, content: "Could't find any quiz questions." }).catch(err => console.log(err));;
            const buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('answer1')
                        .setLabel(`${item.answer1}`)
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('answer2')
                        .setLabel(`${item.answer2}`)
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('answer3')
                        .setLabel(`${item.answer3}`)
                        .setStyle('DANGER'),
                );

            empty.setTitle("Answer this question").setDescription(`${item.question}`)
            interaction.reply({ embeds: [empty], components: [buttons] }).catch(err => console.log(err));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: quiz`)] }).catch(err => console.log(err));;
            return;
        }
    }
}
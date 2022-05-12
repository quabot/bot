const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const quiz = require('../../structures/files/quiz.json');

module.exports = {
    name: "quiz",
    description: "Play a quiz.",
    async execute(client, interaction, color) {
        try {

            const quizItem = quiz[Math.floor(Math.random() * quiz.length)];
            if (!quizItem) return interaction.reply({ embeds: [new MessageEmbed().setColor(color).setDescription(`Could not find any quiz questions.`)], ephemeral: true });
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(color)
                        .setDescription(`${quizItem.question}`)
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('quiz1')
                                .setLabel(`${quizItem.quiz1}`)
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId('quiz2')
                                .setLabel(`${quizItem.quiz2}`)
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('quiz3')
                                .setLabel(`${quizItem.quiz3}`)
                                .setStyle('DANGER')
                        )
                ]
            }).catch(( err => { } ))
        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
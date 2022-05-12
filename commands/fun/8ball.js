const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "8ball",
    description: "Ask a question, get an answer.",
    options: [
        {
            name: "question",
            description: "What is your question?",
            type: "STRING",
            required: true
        },
    ],
    async execute(client, interaction, color) {

        const question = interaction.options.getString("question");

        const options = require('../../structures/files/8ball.json');
        const randomOption = options[Math.floor(Math.random() * options.length)]

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**${question}**\n${randomOption}`)
                    .setColor(color)
            ]
        }).catch(( err => { } ))
    }
}
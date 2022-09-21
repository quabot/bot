const { Interaction, ApplicationCommandOptionType } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: "8ball",
    description: "Ask a question to the magic 8ball.",
    /**
     * @param {Interaction} interaction 
     */
    options: [
        {
            name: "question",
            description: "What do you want to know?",
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],
    async execute(client, interaction, color) {

        await interaction.deferReply().catch((e => { }));
        
        const question = interaction.options.getString("question");

        const answers = ["It is certain", "Without a doubt", "You may rely on it", "Yes definitely", "It is decidedly so", "As I see it, yes", "Most likely", "Yes", "Outlook good", "Signs point to yes", "Reply hazy try again", "Better not tell you now", "Ask again later", "Cannot predict now", "Concentrate and ask again", "Don’t count on it", "Outlook not so good", "My sources say no", "Very doubtful", "My reply is no"];
        interaction.editReply({
            embeds: [await generateEmbed(color, `**${question}**\n${answers[Math.floor(Math.random() * answers.length)]}`)]
        }).catch((e => { }));
    }
}
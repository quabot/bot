const discord = require('discord.js');
const balloptions = require('../../files/8ballOptions.json');
const { COLOR_MAIN } = require('../../files/colors.json')

module.exports = {
    name: "8ball",
    description: "Ask the bot about your future",
    options: [
        {
            name: "question",
            description: "What is your question",
            type: "STRING",
            required: true
        },
    ],
    async execute(client, interaction) {

        try {
            const question = interaction.options.getString("question");
            const random = balloptions[Math.floor(Math.random() * balloptions.length)]

            const embed = new discord.MessageEmbed()
                .setDescription(`${interaction.user}'s 8ball`)
                .addField("Question", `${question}`, true)
                .addField('8ball', `${random}`)
                .setColor(COLOR_MAIN)
                .setTimestamp()
            interaction.reply({ embeds: [embed] }).catch(err => console.log(err));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: coin`)] }).catch(err => console.log(err));;
            return;
        }
    }
}
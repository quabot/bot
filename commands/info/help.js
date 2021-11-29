const discord = require('discord.js');
const { miscEmbed, funEmbed, infoEmbed, musicEmbed, HelpMain, moderationEmbed, managementEmbed } = require('../../files/embeds');
const { HelpSelect } = require('../../files/interactions');
const { errorMain } = require('../../files/embeds');


module.exports = {
    name: "help",
    description: "List of commands and their descriptions.",
    options: [
        {
            name: "category",
            description: "Help category",
            type: "STRING",
            required: false,
        }
    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        try {
            const category = interaction.options.getString('category');
            if (category === "fun" || category === "games") {
                interaction.reply({ embeds: [funEmbed] });
            } else if (category === "info") {
                interaction.reply({ embeds: [infoEmbed] });
            } else if (category === "music") {
                interaction.reply({ embeds: [musicEmbed] });
            } else if (category === "misc") {
                interaction.reply({ embeds: [miscEmbed] });
            } else if (category === "moderation" || category === "mod") {
                interaction.reply({ embeds: [moderationEmbed] });
            } else if (category === "management") {
                interaction.reply({ embeds: [managementEmbed] });
            } else {
                interaction.reply({ embeds: [HelpMain], components: [HelpSelect] });
            }
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }

    }
}
const discord = require("discord.js");

const colors = require('../../files/colors.json');
const {  errorMain } = require('../../files/embeds');

module.exports = {
    name: "announcement",
    description: "Latest quabot news.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        try {
            const embed = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTitle("QuaBot update")
                .setDescription("There are no new updates.")
                .setTimestamp()
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain]})
            console.log(e)
        }
    }
}
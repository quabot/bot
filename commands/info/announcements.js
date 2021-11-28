const discord = require("discord.js");

const colors = require('../../files/colors.json');
const {  errorMain } = require('../../files/embeds');

module.exports = {
    name: "announcement",
    description: "This command is used to give info about new quabot patches.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        try {
            const embed = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTitle("QuaBeta update - 27 November")
                .setDescription("Check it out here: https://discord.quabot.xyz/\nFull changelog can be found here: https://discord.com/channels/847828281860423690/909416619971862578/914269370505637921")
                .setTimestamp()
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain]})
            console.log(e)
        }
    }
}
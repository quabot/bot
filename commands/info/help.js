const { main } = require('../../files/embeds/help');
const { HelpSelect } = require('../../files/interactions/help');
const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "help",
    description: "List of commands and their descriptions.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        try {
            interaction.reply({ embeds: [main], components: [HelpSelect] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}
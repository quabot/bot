const discord = require('discord.js');

const colors = require('../../files/colors.json');
const { adminButtons } = require('../../files/interactions');

module.exports = {
    name: "admin",
    description: "This command allows admins to send messages and do some other things.",
    permission: "ADMINISTRATOR",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
    ],
    async execute(client, interaction) {

        const embed = new discord.MessageEmbed()
            .setColor(colors.TICKET_CREATED)
            .setTitle("Admin")
            .setDescription("Change settings, send messages and more. Settings you can change are:")
            .addField("Ticket Message", "Send a message that users can react to to create a ticket!")
            .setFooter("Change them with the buttons below this message!")
            .setTimestamp()
        interaction.reply({ embeds: [embed], components: [adminButtons], empheral: true });

    }
}
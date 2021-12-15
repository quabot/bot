const discord = require('discord.js');

const colors = require('../../files/colors.json');
const { adminButtons } = require('../../files/interactions');
const { errorMain, ticketDisabled } = require('../../files/embeds');

module.exports = {
    name: "admin",
    description: "General admin features.",
    permission: "ADMINISTRATOR",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
    ],
    async execute(client, interaction) {
        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        logChannelID: "none",
                        reportChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                    return interaction.channel.send({ embeds: [addedDatabase] });
                }
            });
            if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });
    
            const embed = new discord.MessageEmbed()
            .setColor(colors.TICKET_CREATED)
            .setTitle("Admin")
            .setDescription("Change settings, send messages and more. Settings you can change are:")
            .addField("Ticket Message", "Send a message that users can react to to create a ticket!")
            .setFooter("Change them with the buttons below this message!")
            .setTimestamp()
        interaction.reply({ embeds: [embed], components: [adminButtons], empheral: true });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain]})
            console.log(e)
        }
    }
}
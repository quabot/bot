const discord = require('discord.js');

const colors = require('../../files/colors.json');
const config = require('../../files/config.json')
const Guild = require('../../models/guild');

const { closeTicketWCancel } = require('../../files/interactions');

const { errorMain, addedDatabase, ticketsDisabled } = require('../../files/embeds');

module.exports = {
    name: "close",
    description: "This command allows you to close a support ticket.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
    ],
    async execute(client, interaction) {

        const settings = await Guild.findOne({
            guildID: interaction.guild.id
        }, (err, guild) => {
            if (err) interaction.reply({ embeds: [errorMain] });
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    logChannelID: none,
                    enableLog: true,
                    enableSwearFilter: false,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: "Muted",
                    mainRoleName: "Member",
                    reportEnabled: true,
                    reportChannelID: none,
                    suggestEnabled: true,
                    suggestChannelID: none,
                    ticketEnabled: true,
                    ticketChannelName: "Tickets",
                    closedTicketCategoryName: "Closed Tickets",
                    welcomeEnabled: true,
                    welcomeChannelID: none,
                    enableNSFWContent: false,
                });
        
                newGuild.save()
                    .catch(err => interaction.reply({ embeds: [errorMain] }));
        
                return interaction.reply({ embeds: [addedDatabase] });
            }
        });
        if (settings.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

        if (!interaction.channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}` || !interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply("You are not the ticket owner and/or do not have the `KICK_MEMBERS` permission.")
        }

        const embed = new discord.MessageEmbed()
            .setColor(colors.TICKET_CLOSE)
            .setTitle("Close Ticket")
            .setDescription("Close or delete this ticket using the buttons below this message.")
            .setTimestamp()
        interaction.reply({ embeds: [embed], components: [closeTicketWCancel]});
    }
}

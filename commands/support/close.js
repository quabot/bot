const discord = require('discord.js');

const colors = require('../../files/colors.json');
const config = require('../../files/config.json')

const { closeTicketWCancel } = require('../../files/interactions');

const { errorMain, addedDatabase, ticketsDisabled, notATicket } = require('../../files/embeds');
const { noOwner } = require('../../files/embeds');

module.exports = {
    name: "close",
    description: "Close a ticket.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
    ],
    async execute(client, interaction) {

        try {
            console.log(interaction.channel)
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

            let ticketsCatName = guildDatabase.ticketCategory;
            if (ticketsCatName === "undefined") {
                let ticketsCatName = "Tickets";
            }

            let ticketCategory = interaction.guild.channels.cache.find(cat => cat.name === ticketsCatName);

            if (ticketCategory.id !== interaction.channel.parentId) return interaction.reply({ embeds: [notATicket]});

            if (!interaction.channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}` || !interaction.member.permissions.has('ADMINISTRATOR')) {
                return interaction.reply({ embeds: [noOwner] })
            }

            const embed = new discord.MessageEmbed()
                .setColor(colors.TICKET_CLOSE)
                .setTitle("Close Ticket")
                .setDescription("Close or delete this ticket using the buttons below this message.")
                .setTimestamp()
            interaction.reply({ embeds: [embed], components: [closeTicketWCancel] });
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }

    }
}

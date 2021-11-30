const discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

const colors = require('../../files/colors.json');
const config = require('../../files/config.json')

const { errorMain, addedDatabase, ticketsDisabled } = require('../../files/embeds');
const { noOwner } = require('../../files/embeds');

module.exports = {
    name: "reopen",
    description: "Reopen a ticket.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

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

        if (!interaction.channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}` || !interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ embeds: [noOwner] })
        }
        if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });
        const reopenEmbed = new MessageEmbed()
            .setColor(colors.TICKET_CLOSING)
            .setTitle("Re-opening ticket...")
            .setDescription("Close or delete this ticket using the buttons below this message!")
            .setTimestamp()
        interaction.reply({ embeds: [reopenEmbed], components: [closeTicket] });

        let ticketsCatName = guildDatabase.ticketCategory;
        if (ticketsCatName === "undefined") {
            let ticketsCatName = "Tickets";
        }

        let Category = interaction.guild.channels.cache.find(cat => cat.name === ticketsCatName);

        if (Category === undefined) {
            interaction.reply("The tickets category does not exist, creating one now...");
            interaction.guild.channels.create(ticketsCatName, { type: "GUILD_CATEGORY" });
            return interaction.channel.send(":white_check_mark: Succes! Please run the command again to create your ticket.")
        }

        interaction.channel.setParent(Category);
        interaction.channel.permissionOverwrites.edit(interaction.user, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true
        });

    }
}
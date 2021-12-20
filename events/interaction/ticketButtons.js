const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const { errorMain, ticketsDisabled, addedDatabase } = require('../../files/embeds');
const { closeConfirm } = require('../../files/interactions/tickets');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        // failsaves
        try {
            const Guild = require('../../schemas/GuildSchema')
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id
            },
                (err, guild) => {
                    if (err) console.error(err)
                    if (!guild) {
                        const newGuild = new Guild({
                            guildId: interaction.guild.id,
                            guildName: interaction.guild.name,
                            logChannelID: 'none',
                            reportChannelID: 'none',
                            suggestChannelID: 'none',
                            welcomeChannelID: 'none',
                            levelChannelID: 'none',
                            pollChannelID: 'none',
                            ticketCategory: 'Tickets',
                            closedTicketCategory: 'Tickets',
                            logEnabled: true,
                            musicEnabled: true,
                            levelEnabled: true,
                            reportEnabled: true,
                            suggestEnabled: true,
                            ticketEnabled: true,
                            welcomeEnabled: true,
                            pollsEnabled: true,
                            roleEnabled: true,
                            mainRole: 'Member',
                            mutedRole: 'Muted'
                        })
                        newGuild.save().catch(err => {
                            console.log(err)
                            interaction.channel.send({ embeds: [errorMain] })
                        })
                        return interaction.channel.send({ embeds: [addedDatabase] })
                    }
                }
            );

            if (interaction.isButton()) {
                if (interaction.customId === "close") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });
                    const close = new MessageEmbed()
                        .setTitle("Close ticket")
                        .setDescription("Are you sure you want to close this ticket?")
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [close], components: [closeConfirm] })
                }
                if (interaction.customId === "closeconfirm") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

                    let closedName = guildDatabase.closedTicketCategory;
                    if (closedName === undefined) openedName = 'Closed Tickets';
                    const closedCategory = interaction.guild.channels.cache.find(cat => cat.name === closedName);

                    if (!category) {
                        interaction.guild.channels.create(closedName, { type: "GUILD_CATEGORY" });
                        const embedTicketsCreate = new discord.MessageEmbed()
                            .setColor(colors.TICKET_CREATED)
                            .setTitle('Creating a category!')
                            .setDescription('The categegory for closed tickets does not exist. Creating one now...')
                            .setTimestamp()
                        interaction.reply({ embeds: [embedTicketsCreate] })
                        return
                    }

                    interaction.channel.setParent(closedCategory);
                    interaction.channel.permissionOverwrites.edit(interaction.user, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: true,
                        READ_MESSAGE_HISTORY: true
                    });

                    // update send message
                    // add reopen etc button
                }
                if (interaction.customId === "closecancel") {
                    if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });
                    const closeCancel = new MessageEmbed()
                        .setTitle(":x: Cancelled!")
                        .setDescription("Cancelled the closing of the ticket.")
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.update({ embeds: [closeCancel], components: [] })
                }
            }
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}
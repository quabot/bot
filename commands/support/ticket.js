const {
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageButton
} = require('discord.js')

const colors = require('../../files/colors.json')
const { errorMain, addedDatabase, ticketsDisabled } = require('../../files/embeds');
const { close } = require('../../files/interactions/tickets');

module.exports = {
    name: 'ticket',
    description: 'Create a ticket.',
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    options: [{
        name: "topic",
        description: "Ticket topic",
        type: "STRING",
        required: true,
    }, ],
    async execute(client, interaction) {
        try {
            const topic = interaction.options.getString('topic');
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

            if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

            const GIds = require('../../schemas/GuildIds');
            const GIdsDB = await GIds.findOne({
                    verifyToken: 1,
                    gId: interaction.guild.id
                },
                (err, GIds) => {
                    if (err) return;
                    if (!GIds) {
                        const newGids = new GIds({
                            verifyToken: 1,
                            gId: interaction.guild.id,
                            ticketId: 0,
                            suggestId: 0,
                            pollId: 0,
                        })
                        newGids.save().catch(err => {
                            console.log(err)
                            interaction.channel.send({ embeds: [errorMain] })
                        })
                        return interaction.channel.send({ embeds: [addedDatabase] })
                    }
                }
            );

            let newId = GIdsDB.ticketId + 1;
            await GIdsDB.updateOne({
                ticketId: newId,
            });

            let openedName = guildDatabase.ticketCategory;
            if (openedName === undefined) openedName = 'Tickets';
            const category = interaction.guild.channels.cache.find(cat => cat.name === openedName);

            if (!category) {
                interaction.guild.channels.create(openedName, { type: "GUILD_CATEGORY" });
                const embedTicketsCreate = new discord.MessageEmbed()
                    .setColor(colors.TICKET_CREATED)
                    .setTitle('Creating a category!')
                    .setDescription('The tickets categegory does not exist. Creating one now...')
                    .setTimestamp()
                interaction.reply({ embeds: [embedTicketsCreate] })
                return
            }

            interaction.guild.channels.create(`ticket-${newId}`, { parent: category, topic: `Creator: ${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id}) - Topic: ${topic} - Ticket ID: ${newId}` }).then(channel => {

                const createdEmbed = new MessageEmbed()
                    .setTitle("New ticket!")
                    .setDescription(`Welcome to your ticket ${interaction.user}! \nPlease wait here, staff will be with you shortly.`)
                    .addField(`Creator`, `${interaction.user}`)
                    .addField(`Topic`, `${topic}`)
                    .setFooter("Close the ticket with the button below this message!")
                    .setTimestamp()
                    .setColor(colors.COLOR)
                channel.send({ embeds: [createdEmbed], components: [close] });

                const Ticket = require('../../schemas/TicketSchema')
                const newTicket = new Ticket({
                    guildId: interaction.guild.id,
                    memberId: interaction.user.id,
                    ticketId: newId,
                    channelId: channel.id,
                    closed: false,
                    topic: topic,
                });
                newTicket.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [errorMain] });
                    });

                setTimeout(() => {
                    let ticket = interaction.guild.channels.cache.find(channel => channel.name === `ticket-${newId}`);
                    ticket.permissionOverwrites.edit(interaction.user, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true,
                        READ_MESSAGE_HISTORY: true
                    });

                    const embed = new MessageEmbed()
                        .setColor(colors.TICKET_CREATED)
                        .setTitle("Created your ticket :white_check_mark:")
                        .setDescription("You can find it here: <#" + channel + ">")
                        .addField("Topic", `${topic}`)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] })
                }, 300);
            });

            // CHANNEL MESSAGE - Close
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
            return
        }
    }
}
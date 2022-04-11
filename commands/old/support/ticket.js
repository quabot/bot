const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require('discord.js')

const { COLOR_MAIN } = require('../../files/colors.json')
const { error, added } = require('../../embeds/general');
const { close } = require('../../interactions/tickets');
const { ticketDis } = require('../../embeds/support');

module.exports = {
    name: 'ticket',
    description: 'Create a ticket.',
    options: [{
        name: "topic",
        description: "Ticket topic",
        type: "STRING",
        required: true,
    },],
    async execute(client, interaction) {
        try {
            const topic = interaction.options.getString('topic');

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
                        levelEnabled: false,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }).clone().catch(function (err) { console.log(err) });

            if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketDis] }).catch(err => console.log(err));

            const GIds = require('../../schemas/GuildIds');
            const GIdsDB = await GIds.findOne({
                gId: interaction.guild.id
            },
                (err, gids) => {
                    if (err) return;
                    if (!gids) {
                        const newGids = new GIds({
                            gId: interaction.guild.id,
                            ticketId: 0,
                            suggestId: 0,
                            pollId: 0,
                        })
                        newGids.save().catch(err => {
                            console.log(err)
                            interaction.channel.send({ embeds: [error] })
                        })
                        return interaction.channel.send({ embeds: [addedDatabase] })
                    }
                }
            ).clone().catch(function (err) { console.log(err) });

            let ticketrId = GIdsDB.ticketId;
            if (!ticketrId) ticketrId = 0;
            let newId = ticketrId + 1;
            await GIdsDB.updateOne({
                ticketId: newId,
            });

            let openedName = guildDatabase.ticketCategory;
            if (openedName === undefined) openedName = 'Tickets';
            const category = interaction.guild.channels.cache.find(cat => cat.name === openedName);

            if (!category) {
                interaction.guild.channels.create(openedName, { type: "GUILD_CATEGORY" }).catch(err => console.log(" "));
                const embedTicketsCreate = new MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle('Creating a category!')
                    .setDescription('The tickets categegory does not exist. Creating one now...')
                    
                interaction.reply({ embeds: [embedTicketsCreate] }).catch(err => console.log(err));
                return;
            }

            interaction.guild.channels.create(`ticket-${newId}`, { parent: category, topic: `Creator: ${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id}) - Topic: ${topic} - Ticket ID: ${newId}` }).then(channel => {

                const createdEmbed = new MessageEmbed()
                    .setTitle("New ticket!")
                    .setDescription(`Welcome to your ticket ${interaction.user}! \nPlease wait here, staff will be with you shortly.`)
                    .addField(`Creator`, `${interaction.user}`)
                    .addField(`Topic`, `${topic}`)
                    .setFooter("Close the ticket with the button below this message!")
                    
                    .setColor(COLOR_MAIN)
                channel.send({ embeds: [createdEmbed], components: [close] }).catch(err => console.log(" "));

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
                        interaction.channel.send({ embeds: [error] });
                    });

                setTimeout(() => {
                    let ticket = interaction.guild.channels.cache.find(channel => channel.name === `ticket-${newId}`);
                    ticket.permissionOverwrites.edit(interaction.user, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true,
                        READ_MESSAGE_HISTORY: true
                    }).catch(err => console.log(" "));

                    const embed = new MessageEmbed()
                        .setColor(COLOR_MAIN)
                        .setTitle(`Created your ticket! :white_check_mark:`)
                        .setDescription("You can find it here: <#" + channel + `>, , ${interaction.user}!`)
                        .addField("Topic", `${topic}`)
                        
                    interaction.reply({ embeds: [embed] }).catch(err => {
                        interaction.channel.send({ embeds: [embed] });
                    });
                }, 300);
            }).catch(err => console.log(" "));

        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: serverinfo`)] }).catch(err => console.log(err));;
            return;
        }
    }
}
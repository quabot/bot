const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const config = require('../../files/settings.json');
const { errorMain, addedDatabase, ticketsDisabled, notATicket } = require('../../files/embeds');

module.exports = {
    name: "remove",
    description: "Remove a user from your ticket.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "user",
            description: "The user to remove.",
            type: "USER",
            required: true,
        },
    ],
    async execute(client, interaction) {

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
                            levelEnabled: false,
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

            let ticketsCatName = guildDatabase.ticketCategory;
            if (ticketsCatName === "undefined") {
                let ticketsCatName = "Tickets";
            }

            let ticketCategory = interaction.guild.channels.cache.find(cat => cat.name === ticketsCatName);
            if (ticketCategory.id !== interaction.channel.parentId) return interaction.reply({ embeds: [notATicket] });

            const user = interaction.options.getUser('user');

            interaction.channel.permissionOverwrites.edit(user, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false,
                READ_MESSAGE_HISTORY: false
            });

            const embed = new discord.MessageEmbed()
                .setTitle(`:white_check_mark: Removing user...`)
                .setDescription(`Removed ${user} from your support ticket!`)
                .setTimestamp()
                .setColor(colors.COLOR)
            interaction.reply({ embeds: [embed] });

        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}
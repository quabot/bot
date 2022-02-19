const { MessageEmbed } = require('discord.js')

const { COLOR_MAIN } = require('../../files/colors.json')
const { error, added } = require('../../embeds/general');
const { ticketDis, notATicket } = require('../../embeds/support');

module.exports = {
    name: "remove",
    description: "Remove a user from your ticket.",
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
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log("Error!"));
                }
            }).clone().catch(function (err) { console.log(err) });

            if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketDis] }).catch(err => console.log("Error!"));

            let ticketsCatName = guildDatabase.ticketCategory;
            if (ticketsCatName === "undefined") {
                let ticketsCatName = "Tickets";
            }

            let ticketCategory = interaction.guild.channels.cache.find(cat => cat.name === ticketsCatName);
            if (ticketCategory.id !== interaction.channel.parentId) return interaction.reply({ embeds: [notATicket] }).catch(err => console.log("Error!"));

            const user = interaction.options.getUser('user');

            interaction.channel.permissionOverwrites.edit(user, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false,
                READ_MESSAGE_HISTORY: false
            }).catch(err => console.log("Error!"));

            const embed = new MessageEmbed()
                .setTitle(`:white_check_mark: Removing user...`)
                .setDescription(`Removed ${user} from your support ticket!`)
                .setTimestamp()
                .setColor(COLOR_MAIN)
            interaction.reply({ embeds: [embed] }).catch(err => console.log("Error!"));

        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: serverinfo`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}
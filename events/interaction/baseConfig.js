const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');

const { role, noPermission, other, channel, toggle } = require('../../files/embeds/config');
const { selectRole, selectOther, selectToggle, selectChannel } = require('../../files/interactions/config');
const { errorMain, addedDatabase } = require('../../files/embeds.js');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.guild.id === null) return;

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

            if (interaction.isSelectMenu()) {
                if (interaction.values[0] === "change_roles") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ embeds: [role], components: [selectRole], ephemeral: true })
                }
                if (interaction.values[0] === "other_settings") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ embeds: [other], components: [selectOther], ephemeral: true })
                }
                if (interaction.values[0] === "toggle_features") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ embeds: [toggle], components: [selectToggle], ephemeral: true })
                }
                if (interaction.values[0] === "change_channels") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPerms] });
                    interaction.reply({ embeds: [channel], components: [selectChannel], ephemeral: true })
                }
            }

        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}
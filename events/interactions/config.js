const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');

const { events, role, noPermission, other, channel, toggle } = require('../../embeds/config');
const { selectRole, selectOther, selectToggle, selectChannel, toggleEventsSelect } = require('../../interactions/config');
const { error, added } = require('../../embeds/general.js');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {

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
                    transcriptChannelID: "none"
                });
                newGuild.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                    });
                return interaction.channel.send({ embeds: [added] }).catch(err => console.log("Error!"));
            }
        }).clone().catch(function (err) { console.log(err) });

        if (interaction.isSelectMenu()) {
            if (interaction.values[0] === "change_roles") {
                if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                interaction.reply({ embeds: [role], components: [selectRole], ephemeral: true }).catch(err => console.log("Error!"));
            }
            if (interaction.values[0] === "other_settings") {
                if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                interaction.reply({ embeds: [other], components: [selectOther], ephemeral: true }).catch(err => console.log("Error!"));
            }
            if (interaction.values[0] === "event_settings") {
                if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                interaction.reply({ embeds: [events], components: [toggleEventsSelect], ephemeral: true }).catch(err => console.log("Error!"));
            }
            if (interaction.values[0] === "toggle_features") {
                if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                interaction.reply({ embeds: [toggle], components: [selectToggle], ephemeral: true }).catch(err => console.log("Error!"));
            }
            if (interaction.values[0] === "change_channels") {
                if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                interaction.reply({ embeds: [channel], components: [selectChannel], ephemeral: true }).catch(err => console.log("Error!"));
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId === "closeConfig") {
                interaction.update({ components: [], embeds: [new MessageEmbed().setColor(COLOR_MAIN_MAIN).setDescription("This menu has been closed.")]});
            }
        }
    }
}
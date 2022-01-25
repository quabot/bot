const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');

const { misc, support, fun, info, music, moderation, management } = require('../../files/embeds/help');
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
                            mutedRole: 'Muted',
                            joinMessage: "Welcome {user} to **{guild-name}**!",
                            swearEnabled: false,
transcriptChannelID: "none"
                        })
                        newGuild.save().catch(err => {
                            console.log(err)
                            interaction.channel.send({ embeds: [errorMain] })
                        })
                        return;
                    }
                }
            );

            if (interaction.isSelectMenu()) {
                if (interaction.values[0] === "fun_commands") {
                    interaction.reply({ ephemeral: true, embeds: [fun] })
                }
                if (interaction.values[0] === "info_commands") {
                    interaction.reply({ ephemeral: true, embeds: [info] })
                }
                if (interaction.values[0] === "music_commands") {
                    interaction.reply({ ephemeral: true, embeds: [music] })
                }
                if (interaction.values[0] === "moder_commands") {
                    interaction.reply({ ephemeral: true, embeds: [moderation] });
                }
                if (interaction.values[0] === "mang_commands") {
                    interaction.reply({ ephemeral: true, embeds: [management] });
                }
                if (interaction.values[0] === "misc_commands") {
                    interaction.reply({ ephemeral: true, embeds: [misc] })
                }
                if (interaction.values[0] === "support_commands") {
                    interaction.reply({ ephemeral: true, embeds: [support] })
                }
            }
            
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}
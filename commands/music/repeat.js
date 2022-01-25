const discord = require('discord.js');
const mongoose = require('mongoose');
const { joinVoiceChannel } = require('@discordjs/voice');

const colors = require('../../files/colors.json');
const { errorMain, addedDatabase, NotInVC, MusicIsDisabled, noSongs, noValidMode } = require('../../files/embeds');
const { skipButtons } = require('../../files/interactions/music');

module.exports = {
    name: "repeat",
    description: "Alter repeat mode.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "repeatmode",
            description: "0 - OFF, 1 - REPEAT SONG or 2 - REPEAT QUEUE",
            type: "INTEGER",
            required: true,
        }
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
                        closedTicketCategory: "Closed Tickets",
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
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        swearEnabled: false,
transcriptChannelID: "none"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                    return interaction.channel.send({ embeds: [addedDatabase] });
                }
            });

            if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [MusicIsDisabled] })

            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member.voice.channel) return interaction.reply({ embeds: [NotInVC] });
            const queue = client.player.getQueue(interaction);
            if (!queue) return interaction.reply({ embeds: [noSongs] });

            const newMode = interaction.options.getInteger('repeatmode');
            if (newMode === 0 || newMode === 1 || newMode === 2) {
                let mode = client.player.setRepeatMode(interaction, newMode);
                mode = mode ? mode == 2 ? "Repeat queue :repeat:" : "Repeat song :repeat_one:" : "Off :arrow_forward:";

                const embed = new discord.MessageEmbed()
                    .setTitle(":repeat:  Changed repeat mode!")
                    .setDescription(`${mode}`)
                    .setColor(colors.COLOR)
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } else {
                return interaction.reply({ embeds: [noValidMode], components: [skipButtons] });
            }
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}
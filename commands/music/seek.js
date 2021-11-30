const discord = require('discord.js');
const mongoose = require('mongoose');
const { joinVoiceChannel } = require('@discordjs/voice');

const colors = require('../../files/colors.json');
const { errorMain, addedDatabase, NotInVC, MusicIsDisabled, noSongs, noValidSeek } = require('../../files/embeds');

module.exports = {
    name: "seek",
    description: "Seek to a point in the song.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "seconds",
            description: "Time in seconds",
            type: "INTEGER",
            required: true,
        }
    ],
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

        if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [MusicIsDisabled] });

        const member = interaction.guild.members.cache.get(interaction.user.id);
        if (!member.voice.channel) return interaction.reply({ embeds: [NotInVC] });
        const queue = client.player.getQueue(interaction);
        if (!queue) return interaction.reply({ embeds: [noSongs] });

        const timeNew = interaction.options.getInteger('seconds');
        if (timeNew <= 0) return interaction.reply({ embeds: [noValidSeek] });
        if (timeNew >= 10000) return interaction.reply({ embeds: [noValidSeek] });

        const song = queue.songs[0];

        client.player.seek(interaction, Number(timeNew));
        const embed = new discord.MessageEmbed()
            .setTitle("Seeked song!")
            .setDescription(`Seeked song to: **${Number(timeNew)}**`)
            .setColor(colors.COLOR)
            .setTimestamp()
        interaction.reply({ embeds: [embed] });
    }
}
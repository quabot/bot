const discord = require('discord.js');
const mongoose = require('mongoose');
const { joinVoiceChannel } = require('@discordjs/voice');

const colors = require('../../files/colors.json');
const { errorMain, addedDatabase, NotInVC, MusicIsDisabled, noSongs, noValidVolume } = require('../../files/embeds');

module.exports = {
    name: "volume",
    description: "Change volume.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "volume",
            description: "New value",
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

        const volumeNew = interaction.options.getInteger('volume');
        if (volumeNew <= 0) return interaction.reply({ embeds: [noValidVolume] });
        if (volumeNew >= 101) return interaction.reply({ embeds: [noValidVolume] });

        const song = queue.songs[0];

        client.player.setVolume(interaction, volumeNew);
        const newVolume = new discord.MessageEmbed()
            .setTitle("Changed Volume! :speaker:")
            .setThumbnail(song.thumbnail)
            .setDescription(`Succesfully set the volume to **${volumeNew}%**`)
            .setColor(colors.COLOR);
        interaction.reply({ embeds: [newVolume] });
    }
}
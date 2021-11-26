const discord = require('discord.js');
const mongoose = require('mongoose');
const { joinVoiceChannel } = require('@discordjs/voice');

const colors = require('../../files/colors.json');
const { errorMain, addedDatabase, NotInVC, MusicIsDisabled, noSongs } = require('../../files/embeds');

module.exports = {
    name: "autoplay",
    description: "Toggle the automatic playing or similar songs on or off.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
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
        if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [MusicIsDisabled] })

        const member = interaction.guild.members.cache.get(interaction.user.id);
        if (!member.voice.channel) return interaction.reply({ embeds: [NotInVC] });
        const queue = client.player.getQueue(interaction);
        if (!queue) return interaction.reply({ embeds: [noSongs]});

        const embed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setTitle(`:white_check_mark: Toggled autoplay ${client.player.toggleAutoplay(interaction) ? "ON" : "OFF"}!`)
            .setDescription('When enabled, it makes it so that when the queue finishes playing, it will find songs that are relatabe to the last song in queue!')
        interaction.reply({ embeds: [embed] })
    }
}
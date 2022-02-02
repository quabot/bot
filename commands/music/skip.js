const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const { skipButtons } = require('../../files/interactions/music');
const { errorMain, skippedSong, addedDatabase, NotInVC, MusicIsDisabled, noSongs } = require('../../files/embeds');


module.exports = {
    name: "skip",
    description: "Skip a song.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
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

            if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [MusicIsDisabled] });

            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member.voice.channel) return interaction.reply({ embeds: [NotInVC] });

            const queue = client.player.getQueue(interaction);
            if (!queue) return interaction.reply({ embeds: [noSongs] });

            const song1 = queue.songs[1];
            if (!song1) return interaction.reply({ embeds: [noSongs] });

            client.player.skip(queue);
            interaction.reply({ embeds: [skippedSong], components: [skipButtons] });
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}
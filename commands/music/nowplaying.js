const discord = require('discord.js');
const DisTube = require('distube');

const colors = require('../../files/colors.json');
const { errorMain, addedDatabase, NotInVC, MusicIsDisabled, noSongs } = require('../../files/embeds');

module.exports = {
    name: "nowplaying",
    description: "Information about playing song.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
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

            let song = queue.songs[0];
            if (!song) return interaction.reply({ embeds: [noSongs] });

            const playingEmbed = new discord.MessageEmbed()
                .setTitle("Now Playing")
                .setColor(colors.COLOR)
                .setDescription(`${song.name}`)
                .setThumbnail(song.thumbnail)
                .addField("Added by", `${song.user}`, true)
                .addField("Volume", `\`${queue.volume}%\``, true)
                .addField("Queue", `${queue.songs.length} song(s)`, true)
                .addField("Likes", `${song.likes}`, true)
                .addField("Views", `${song.views}`, true)
                .addField("Duration", `\`${song.formattedDuration}\``, true)
            interaction.reply({ embeds: [playingEmbed] });
        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}
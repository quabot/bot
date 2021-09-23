const discord = require('discord.js');
const DisTube = require('distube');

const Guild = require('../../models/guild');
const colors = require('../../files/colors.json');
const { errorMain, addedDatabase, NotInVC, MusicDisabled, NotPlaying } = require('../../files/embeds');
module.exports = {
    name: "nowplaying",
    aliases: ["np"],
    async execute(client, message, args) {

        console.log("Command `nowplaying` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) message.channel.send({ embeds: [errorMain]});
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: config.PREFIX,
                    logChannelID: none,
                    enableLog: false,
                    enableSwearFilter: true,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: muted,
                    mainRoleName: member
                });

                newGuild.save()
                    .catch(err => message.channel.send({ embeds: [errorMain]}));

                return message.channel.send({ embeds: [addedDatabase]});
            }
        });

        if (settings.enableMusic === "false") return message.channel.send({ embeds: [MusicDisabled]});
        if (!message.member.voice.channel) return message.channel.send({ embeds: [NotInVC]});

        let queue = client.player.getQueue(message); 
        if (!queue) return message.channel.send(noPlay);
        let song = queue.songs[0]

        const playingEmbed = new discord.MessageEmbed()
            .setTitle("Now Playing")
            .setColor(colors.COLOR)
            .setDescription(`${song.name}`)
            .setThumbnail(song.thumbnail)
            .addField("Added by", `${song.user}`, true)
            .addField("Volume", `\`${queue.volume}%\``, true)
            .addField("Queue", `${queue.songs.length} song(s)`, true)
            .addField("Duration", `\`${(Math.floor(song.duration / 1000 / 60 * 100) / 100).toString().replace(".", ":")}/${song.formattedDuration}\``)
        message.channel.send({ embeds: [playingEmbed] });

    }
}
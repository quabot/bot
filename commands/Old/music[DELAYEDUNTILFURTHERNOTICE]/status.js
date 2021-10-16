const discord = require('discord.js');
const DisTube = require('distube');

const Guild = require('../../models/guild');
const colors = require('../../files/colors.json');

const noPlay = new discord.MessageEmbed()
    .setDescription("There is nothing playing!")
    .setColor(colors.COLOR);
const notVC = new discord.MessageEmbed()
    .setDescription("You need to be in a voice channel to play songs!")
    .setColor(colors.COLOR);
const musicOff = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription("Music is disabled!");
    const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)
module.exports = {
    name: "status",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `status` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) message.channel.send(errorMain);
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
                    .catch(err => message.channel.send(errorMain));

                return message.channel.send(addedDatabase);
            }
        });

        if (settings.enableMusic === "false") return message.channel.send(musicOff);
        if (!message.member.voice.channel) return message.channel.send(notVC);

        client.player.skip(message);

        let queue = client.player.getQueue(message); 
        if(!queue) return message.channel.send(noPlay);
        let song = queue.songs[0];

        const status = new discord.MessageEmbed()
            .setTitle("Queue status")
            .setThumbnail(song.thumbnail)
            .addField("Queue", `${queue.songs.length} songs`, true)
            .addField("Song", `\`${song.name}\``, true)
            .addField("Current repeat mode", `${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue :repeat:" : "This Song :repeat_one:" : "Off :arrow_forward:"}`, true)
            .addField("Autoplay", `\`${queue.autoplay}\``, true)
            .addField("Volume", `\`${queue.volume}%\``, true)
            .addField("Duration", `\`${(Math.floor(queue.currentTime / 1000 / 60 * 100) / 100).toString().replace(".", ":")}/${song.formattedDuration}\``, true)
            .setColor(colors.COLOR);
        message.channel.send(status);
    }
}
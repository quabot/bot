const discord = require('discord.js');
const DisTube = require('distube');

const Guild = require('../models/guild');
const colors = require('../files/colors.json');

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
    name: "skip",
    aliases: ["s"],
    async execute(client, message, args) {

        console.log("Command `skip` was used.");

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

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
        if (!queue) return message.channel.send(noPlay);
        let song = queue.songs[1];

        if(!song) return message.channel.send("Skipped a song!")

        const skipped = new discord.MessageEmbed()
            .setTitle(":track_next: Skipped a song!")
            .addField("Queue", `${queue.songs.length} songs - \`${(Math.floor(queue.duration / 1000 / 60 * 100) / 100).toString().replace(".", ":")}\``, true)
            .addField("Song", `\`${song.name}\``, true)
            .setColor(colors.COLOR);
        message.channel.send(skipped);
    }
}
const discord = require('discord.js');
const DisTube = require('distube');
const distube = require('../../index');
const ytdl = require('ytdl-core');

const Guild = require('../../models/guild');
const colors = require('../../files/colors.json');

const notVC = new discord.MessageEmbed()
    .setDescription("You need to be in a voice channel to play songs!")
    .setColor(colors.COLOR);
const noSearch = new discord.MessageEmbed()
    .setDescription("Please provide a search!")
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
    name: "play",
    aliases: ["p"],
    async execute(client, message, args) {

        console.log("Command `play` was used.");

        //if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
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

        if (settings.enableMusic === "false") return message.channel.send({ embeds: [musicOff] });
        if (!message.member.voice.channel) return message.channel.send({ embeds: [notVC] });

        let search = args.join(" ");
        if (!search) return message.channel.send({ embeds: [noSearch] });
        let queue = client.player.getQueue(message);

        client.player.play(message, search);
        //queue.add(message,search);
    }
}
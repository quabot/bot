const { Client, Intents } = require('discord.js');
const Discord = require("discord.js");
const DisTube = require("distube")
const consola = require('consola')
const client = new Client({ intents: 32767 });
module.exports = client;
const Levels = require("discord.js-leveling");
const mongoose = require("./utils/mongoose");
client.mongoose = require('./utils/mongoose');
const colors = require('./files/colors.json');
const { errorMain, addedDatabase, noWelcomeChannel } = require('./files/embeds');
const config = require('./files/config.json');
const Guild = require('./models/guild');
client.commands = new Discord.Collection();
['commands', 'events'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
});
consola.success('Loaded index.js!')
const prefix = "/";

client.player = new DisTube.default(client, {
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
});

client.player.on('playSong', (queue, song) => {
    const playingEmbed = new Discord.MessageEmbed()
        .setTitle("Now Playing")
        .setColor(colors.COLOR)
        .setDescription(`${song.name}`)
        .setThumbnail(song.thumbnail)
        .addField("Views", `${song.views}`, true)
        .addField("Likes", `${song.likes}`, true)
        .addField("Disikes", `${song.dislikes}`, true)
        .addField("Added by", `${song.user}`, true)
        .addField("Volume", `\`${queue.volume}%\``, true)
        .addField("Queue", `${queue.songs.length} songs - \`${(Math.floor(queue.duration / 1000 / 60 * 100) / 100).toString().replace(".", ":")}\``, true)
        .addField("Autoplay", `\`${queue.autoplay}\``, true)
        .addField("Repeat", `\`${queue.repeatMode ? queue.repeatMode === 2 ? "Repeat Queue" : "Repeat Song" : "Off"}\``, true)
        .addField("Duration", `\`${(Math.floor(queue.currentTime / 1000 / 60 * 100) / 100).toString().replace(".", ":")}/${song.formattedDuration}\``, true)
        queue.textChannel.send({ embeds: [playingEmbed] });
});

client.player.on("addSong", (queue, song) => {
    const embed = new Discord.MessageEmbed()
        .setColor(colors.COLOR)
        .setTitle("Song added to the queue")
        .setThumbnail(song.thumbnail)
        .setDescription(`${song.name}`)
        .addField("Added by", `${song.user}`, true)
        .addField("Queue", `${queue.songs.length} songs - \`${(Math.floor(queue.duration / 1000 / 60 * 100) / 100).toString().replace(".", ":")}\``, true)
        .addField("Duration", `${song.formattedDuration}`, true)
    queue.textChannel.send({ embeds: [embed] });
});

client.player.on('error', (channel, err) => {
    console.log(err)
    const musicErrorEmbed = new Discord.MessageEmbed()
        .setTitle(":x: There was an error!")
        .setColor(colors.COLOR)
    channel.send({ embeds: [musicErrorEmbed] });
});

client.player.on('finish', queue  => {
    const finishQueueEmbed = new Discord.MessageEmbed()
        .setTitle(":x: There are no more songs in queue, leaving voice channel!")
        .setColor(colors.COLOR)
    queue.textChannel.send({ embeds: [finishQueueEmbed] });
});

client.player.on('initQueue', queue => {
    queue.autoplay = false,
        queue.volume = 50
});

client.player.on('noRelated', queue  => {
    const noRelatedEmbed = new Discord.MessageEmbed()
        .setTitle(":x: Could not find any related songs, ending queue!")
        .setColor(colors.COLOR)
    queue.textChannel.send({ embeds: [noRelatedEmbed] });
});

const { GiveawaysManager } = require('discord-giveaways');

const manager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    default: {
        botsCanWin: false,
        embedColor: '#ff38f8',
        embedColorEnd: '#030061',
        reaction: '🎉'
    }
});
client.giveawaysManager = manager;

const { miscEmbed, funEmbed, infoEmbed, musicEmbed, moderationEmbed, managementEmbed } = require('./files/embeds');
const ModMain = new Discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Select Management or Moderation commands in the dropdown below.")
    .setDescription("When selecting a category you'll get a detailed list of commands within that category.")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
const selectMod = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Moderation Commands',
                    description: 'These commands are used to punish users and moderate the server.',
                    value: 'moder_commands',
                },
                {
                    label: 'Management Commands',
                    description: 'These commands are used by managers to clear channels, start giveaways and more.',
                    value: 'mang_commands',
                },
            ]),
    );
const noperms = new Discord.MessageEmbed()
    .setTitle(":x: You do not have permission!")
    .setColor(colors.COLOR)
client.on("interactionCreate", async (interaction) => {
    if (interaction.isSelectMenu()) {
        if (interaction.values[0] === "fun_commands") {
            interaction.reply({ ephemeral: true, embeds: [funEmbed] })
        }
        if (interaction.values[0] === "info_commands") {
            interaction.reply({ ephemeral: true, embeds: [infoEmbed] })
        }
        if (interaction.values[0] === "music_commands") {
            interaction.reply({ ephemeral: true, embeds: [musicEmbed] })
        }
        if (interaction.values[0] === "mod_commands") {
            interaction.reply({ ephemeral: true, embeds: [ModMain], components: [selectMod] });
        }
        if (interaction.values[0] === "moder_commands") {
            interaction.reply({ ephemeral: true, embeds: [moderationEmbed] });
        }
        if (interaction.values[0] === "mang_commands") {
            interaction.reply({ ephemeral: true, embeds: [managementEmbed] });
        }
        if (interaction.values[0] === "misc_commands") {
            interaction.reply({ ephemeral: true, embeds: [miscEmbed] })
        }
    }
});

Levels.setURL("mongodb+srv://admin:AbyUoKpaaWrjK@cluster.n4eqp.mongodb.net/Database?retryWrites=true&w=majority");
client.mongoose.init();
client.login(config.BOT_TOKEN);
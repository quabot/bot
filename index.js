const { Client, Intents } = require('discord.js');
const client = new Client({
	intents: [
		'GUILDS',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGES',
	],
})

const Discord = require("discord.js");
const Levels = require("discord.js-leveling");
const { GiveawaysManager } = require('discord-giveaways');
const DisTube = require('distube');
const mongoose = require("./utils/mongoose");
const colors = require('./files/colors.json');
const config = require('./files/config.json');

client.commands = new Discord.Collection();
client.mongoose = require('./utils/mongoose');

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
});

const player = new DisTube.default(client, {
	searchSongs: 1,
	leaveOnEmpty: true,
	emptyCooldown: 60,
	leaveOnFinish: true,
	leaveOnStop: true
})

player.on('playSong', (message, queue, song) => {
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
    message.channel.send(playingEmbed);
});

player.on('addSong', (message, queue, song) => {
    const addedEmbed = new Discord.MessageEmbed()
        .setColor(colors.COLOR)
        .setTitle("Song added to the queue")
        .setDescription(song.name)
        .addField("Added by", song.user, true)
        .addField("Queue", `${queue.songs.length} songs - \`${(Math.floor(queue.duration / 1000 / 60 * 100) / 100).toString().replace(".", ":")}\``, true)
        .addField("Duration", `${song.formattedDuration}`, true)
    message.channel.send(addedEmbed);
});

player.on('error', (message, err) => {
    const musicErrorEmbed = new Discord.MessageEmbed()
        .setDescription("There was an error!")
        .setColor(colors.COLOR)
    message.channel.send(musicErrorEmbed);
});

player.on('finish', message => {
    const finishQueueEmbed = new Discord.MessageEmbed()
        .setDescription("There are no more songs in queue, leaving voice channel!")
        .setColor(colors.COLOR)
    message.channel.send(finishQueueEmbed);
});

player.on('initQueue', queue => {
    queue.autoplay = false,
        queue.volume = 50
});

player.on('noRelated', message => {
    const noRelatedEmbed = new Discord.MessageEmbed()
        .setDescription("Could not find any related songs, stopping queue!")
        .setColor(colors.COLOR)
    message.channel.send(noRelatedEmbed);
});

client.player = player;

client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./files/giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});

Levels.setURL("mongodb+srv://admin:AbyUoKpaaWrjK@cluster.n4eqp.mongodb.net/Database?retryWrites=true&w=majority");
client.mongoose.init();
client.login(config.BOT_TOKEN);
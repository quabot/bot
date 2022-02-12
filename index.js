const discord = require('discord.js');
const client = new discord.Client({ intents: 6095, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
require('dotenv').config()

client.commands = new discord.Collection();
['commands', 'events'].forEach(handler => {
    require(`./handlers/${handler}`)(client, discord);
});

client.login(process.env.TOKEN);

const DisTube = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { playButtons } = require('./interactions/music');
const { COLOR_MAIN } = require('./files/colors.json');
const { MessageEmbed } = require('discord.js');
client.player = new DisTube.default(client, {
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
    updateYouTubeDL: false,
});
client.player.on('playSong', (queue, song) => {
    const playingEmbed = new MessageEmbed()
        .setTitle("Now Playing")
        .setColor(COLOR_MAIN)
        .setDescription(`${song.name}`)
        .setTimestamp()
        .setThumbnail(song.thumbnail)
        .addField("Views", `${song.views}`, true)
        .addField("Likes", `${song.likes}`, true)
        .addField("Added by", `${song.user}`, true)
        .addField("Volume", `\`${queue.volume}%\``, true)
        .addField("Queue", `${queue.songs.length} songs - \`${(Math.floor(queue.duration / 1000 / 60 * 100) / 100).toString().replace(".", ":")}\``, true)
        .addField("Autoplay", `\`${queue.autoplay}\``, true)
        .addField("Repeat", `\`${queue.repeatMode ? queue.repeatMode === 2 ? "Repeat Queue" : "Repeat Song" : "Off"}\``, true)
        .addField("Duration", `\`${(Math.floor(queue.currentTime / 1000 / 60 * 100) / 100).toString().replace(".", ":")}/${song.formattedDuration}\``, true)
    queue.textChannel.send({ embeds: [playingEmbed], components: [playButtons] });
});
client.player.on("addSong", (queue, song) => {
    const embed = new MessageEmbed()
        .setColor(COLOR_MAIN)
        .setTitle("Song added to the queue")
        .setThumbnail(song.thumbnail)
        .setDescription(`${song.name}`)
        .setTimestamp()
        .addField("Added by", `${song.user}`, true)
        .addField("Queue", `${queue.songs.length} songs - \`${(Math.floor(queue.duration / 1000 / 60 * 100) / 100).toString().replace(".", ":")}\``, true)
        .addField("Duration", `${song.formattedDuration}`, true)
    queue.textChannel.send({ embeds: [embed] });
});
client.player.on('error', (channel, err) => {
    console.log(err)
    const musicErrorEmbed = new MessageEmbed()
        .setTitle(":x: There was an error!")
        .setTimestamp()
        .setColor(COLOR_MAIN)
    channel.send({ embeds: [musicErrorEmbed] });
});
client.player.on('finish', queue => {
    const finishQueueEmbed = new MessageEmbed()
        .setTitle(":x: There are no more songs in queue, leaving voice channel!")
        .setTimestamp()
        .setColor(COLOR_MAIN)
    queue.textChannel.send({ embeds: [finishQueueEmbed] });
});
client.player.on('initQueue', queue => {
    queue.autoplay = false,
        queue.volume = 50
});
client.player.on('noRelated', queue => {
    const noRelatedEmbed = new MessageEmbed()
        .setTitle(":x: Could not find any related songs, queue ended!")
        .setColor(COLOR_MAIN)
        .setTimestamp()
    queue.textChannel.send({ embeds: [noRelatedEmbed] });
});
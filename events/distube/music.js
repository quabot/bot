const client = require('../../index');
const { MessageEmbed } = require('discord.js');
const { color } = require('../../structures/settings.json');

client.distube
    .on('playSong', (queue, song) => {

        queue.textChannel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle("Now Playing")
                    .setColor(color)
                    .setDescription(`${song.name}`)
                    .setThumbnail(song.thumbnail)
                    .addField("Views", `${song.views.toLocaleString()}`, true)
                    .addField("Likes", `${song.likes.toLocaleString()}`, true)
                    .addField("Duration", `\`${song.formattedDuration}\``, true)
                    .addField("Volume", `\`${queue.volume}%\``, true)
                    .addField("Queue", `${queue.songs.length} songs`, true)
                    .addField("Autoplay", `\`${queue.autoplay ? "Enabled" : "Disabled"}\``, true)
                    .addField("Repeat", `\`${queue.repeatMode ? queue.repeatMode === 2 ? "Repeat Queue" : "Repeat Song" : "Off"}\``, true)]
        });
    })

    .on("addSong", (queue, song) => {
        queue.textChannel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setTitle("Song added to the queue")
                    .setThumbnail(song.thumbnail)
                    .setDescription(`${song.name}`)
                    .addField("Added by", `${song.user}`, true)
                    .addField("Queue", `${queue.songs.length} songs - \`${(Math.floor(queue.duration / 1000 / 60 * 100) / 100).toString().replace(".", ":")}\``, true)
                    .addField("Duration", `${song.formattedDuration}`, true)]
        });
    })

    .on('error', (channel, err) => {
        console.log(err);
        channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(":x: There was an error with the music stream.")
                    .setColor(color)
            ]
        });
    })

    .on('finish', queue => {
        queue.textChannel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(":x: There are no more songs in queue, leaving voice channel!")
                    .setColor(color)
            ]
        });
    })
    .on('initQueue', queue => {
        queue.autoplay = false,
        queue.volume = 50
    })

    .on('noRelated', queue => {
        queue.textChannel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(":x: Could not find any related songs, queue ended!")
                    .setColor(color)
            ]
        });
    });
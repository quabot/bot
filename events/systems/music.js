const client = require('../../index');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

// Create the function to fetch the embed color.
async function getColor(guildId) {
    const Customization = require('../../structures/schemas/CustomizationSchema');
    const CustomizationDatabase = await Customization.findOne({
        guildId,
    }, (err, customization) => {
        if (err) console.log(err);
        if (!customization) {
            const newCustomization = new Customization({
                guildId,
                color: "#3a5a74"
            });
            newCustomization.save();
        }
    }).clone().catch((err => { }));

    if (!CustomizationDatabase) return;

    return CustomizationDatabase.color;
}

const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('music-volume-down')
            .setLabel('🔉')
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('music-volume-up')
            .setLabel('🔊')
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('music-pause')
            .setLabel('⏸️')
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('music-play')
            .setLabel('▶️')
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('music-skip')
            .setLabel('⏭️')
            .setStyle('SECONDARY'),
    );

client.distube
    .on('playSong', async (queue, song) => {

        const color = await getColor(queue.textChannel.guildId);

        queue.textChannel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle("Now playing:")
                    .setColor(color)
                    .setDescription(`[${song.name}](${song.url})`)
                    .setThumbnail(song.thumbnail)
                    .addField("Views", `${song.views.toLocaleString()}`, true)
                    .addField("Likes", `${song.likes.toLocaleString()}`, true)
                    .addField("Duration", `\`${song.formattedDuration}\``, true)
                    .addField("Volume", `\`${queue.volume}%\``, true)
                    .addField("Queue", `${queue.songs.length} song(s) - \`${queue.formattedDuration}\``, true)
                    .addField("Autoplay", `\`${queue.autoplay ? "Enabled" : "Disabled"}\``, true)
                    .addField("Repeat", `\`${queue.repeatMode ? queue.repeatMode === 2 ? "Repeat Queue" : "Repeat Song" : "Off"}\``, true)
            ],
            components: [row]
        }).catch((err) => { });
    })

    .on("addSong", async (queue, song) => {

        const color = await getColor(queue.textChannel.guildId);

        queue.textChannel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setTitle("Song added to the queue")
                    .setThumbnail(song.thumbnail)
                    .setDescription(`[${song.name}](${song.url})`)
                    .addField("Added by", `${song.member}`, true)
                    .addField("Queue", `${queue.songs.length} song(s) - \`${queue.formattedDuration}\``, true)
                    .addField("Duration", `\`${song.formattedDuration}\``, true)
            ],
            components: [row]
        }).catch((err) => { });
    })

    .on('error', async (channel, err) => {
        const color = await getColor(channel.guildId);

        console.log(err);

        channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription("There was an error with the music stream.")
                    .setColor(color)
            ]
        }).catch((err) => { });
    })

    .on('finish', async (queue) => {

        const color = await getColor(queue.textChannel.guildId);

        queue.textChannel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription("There are no more songs in queue, leaving voice channel!")
                    .setColor(color)
            ]
        }).catch((err) => { });
    })
    .on('initQueue', queue => {
        queue.autoplay = false,
            queue.volume = 50
    })

    .on('noRelated', async (queue) => {

        const color = await getColor(queue.textChannel.guildId);

        queue.textChannel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription("Could not find any related songs, queue ended!")
                    .setColor(color)
            ]
        }).catch((err) => { });
    });
const Discord = require("discord.js");
const client = new Discord.Client({ intents: 16319, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
require('dotenv').config()

// COMMANDS
client.commands = new Discord.Collection();
['commands', 'events'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
});

const { MiscSupport } = require('./files/interactions')

// DATABASE
const mongoose = require('mongoose');
const consola = require('consola');
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then((m) => {
        consola.success("Connected to database!");
    })
    .catch((err) => consola.error(err));

// MUSIC
const DisTube = require("distube");
const { errorMain, addedDatabase } = require('./files/embeds');
const colors = require('./files/colors.json');
client.player = new DisTube.default(client, {
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    updateYouTubeDL: false,
});
client.player.on('playSong', (queue, song) => {
    const playingEmbed = new Discord.MessageEmbed()
        .setTitle("Now Playing")
        .setColor(colors.COLOR)
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
    queue.textChannel.send({ embeds: [playingEmbed] });
});
client.player.on("addSong", (queue, song) => {
    const embed = new Discord.MessageEmbed()
        .setColor(colors.COLOR)
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
    const musicErrorEmbed = new Discord.MessageEmbed()
        .setTitle(":x: There was an error!")
        .setTimestamp()
        .setColor(colors.COLOR)
    channel.send({ embeds: [musicErrorEmbed] });
});
client.player.on('finish', queue => {
    const finishQueueEmbed = new Discord.MessageEmbed()
        .setTitle(":x: There are no more songs in queue, leaving voice channel!")
        .setTimestamp()
        .setColor(colors.COLOR)
    queue.textChannel.send({ embeds: [finishQueueEmbed] });
});
client.player.on('initQueue', queue => {
    queue.autoplay = false,
        queue.volume = 50
});
client.player.on('noRelated', queue => {
    const noRelatedEmbed = new Discord.MessageEmbed()
        .setTitle(":x: Could not find any related songs, queue ended!")
        .setColor(colors.COLOR)
        .setTimestamp()
    queue.textChannel.send({ embeds: [noRelatedEmbed] });
});

// GIVEAWAYS
const { GiveawaysManager } = require('discord-giveaways');
const manager = new GiveawaysManager(client, {
    storage: './files/giveaways.json',
    default: {
        botsCanWin: false,
        embedColor: `${colors.COLOR}`,
        embedColorEnd: `${colors.LIME}`,
        reaction: '🎉'
    }
});
client.giveawaysManager = manager;

const { miscEmbed, supportHEmbed, funEmbed, infoEmbed, musicEmbed, moderationEmbed, managementEmbed } = require('./files/embeds');
const ModMain = new Discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Select Management or Moderation commands in the dropdown below.")
    .setDescription("When selecting a category you'll get a detailed list of commands within that category.")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
const SiscMain = new Discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Select Misc or Support commands in the dropdown below.")
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
        if (interaction.values[0] === "misc_sup_commands") {
            interaction.reply({ ephemeral: true, embeds: [SiscMain], components: [MiscSupport] });
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
        if (interaction.values[0] === "support_commands") {
            interaction.reply({ ephemeral: true, embeds: [supportHEmbed] })
        }
    }
});

client.on('messageReactionAdd', async (reaction, user) => {

    const React = require('./schemas/ReactSchema');
    const reactList = await React.findOne({
        guildId: reaction.message.guildId,
        messageId: reaction.message.id,
        emoji: reaction._emoji.name,
    }, (err, react) => {
        if (err) console.error(err);
        if (!react) {
            return;
        }
        return;
    });
    if (!reactList) return;
    let emojiRole = reaction.message.guild.roles.cache.find(role => role.id === `${reactList.role}`);
    if (!emojiRole) return reaction.message.reply("Error! No role found! Deleting reaction role now.");
    // delete record

    if (reactList.reactMode === "normal") {
        userTarget.send(`You were given the role **${emojiRole.name}** in **${reaction.message.guild.name}**!`);
        
    }
});

const Levels = require("discord.js-leveling");
Levels.setURL(process.env.DATABASE_URL);
consola.success('Loaded index.js!');
client.login(process.env.TOKEN);
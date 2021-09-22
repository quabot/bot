const { Client, Intents } = require('discord.js');
const client = new Client({
	intents: [
		'GUILDS',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGES',
        'GUILD_PRESENCES',
        'GUILD_MEMBERS'
	],
});

const Discord = require("discord.js");
const Levels = require("discord.js-leveling");
const { GiveawaysManager } = require('discord-giveaways');
const DisTube = require('distube');
const mongoose = require("./utils/mongoose");
const Guild = require('./models/guild');
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

const prefix = "!";

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

const ModMain = new Discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Select Management or Moderation commands in the dropdown below.")
    .setDescription("When selecting a category you'll get a detailed list of commands within that category.")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
const funEmbed = new Discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Fun Commands")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setDescription(`These commands give funny pictures, games and more.\n\n**${prefix}coin** - When using this command you will flip a virtual coin.\n**${prefix}cat** - When you use this command you will recieve a cute picture of a cat.\n**${prefix}dog** - By using this command you recieve picture of a dog.\n**${prefix}meme** - When you use this command you get a random meme from a subreddit.\n**${prefix}rps** - With this command you can play rock, paper, scissors with the bot.\n**${prefix}type** - Play a game that makes you type words/sentences in 15 seconds.`);
const infoEmbed = new Discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Info Commands")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setDescription(`These commands are used to get information about loads of different things.\n\n**${prefix}server** - By using this command you get the server name.\n**${prefix}donate** - This command is used to get info about donations to quabot.\n**${prefix}help** - By using this command you will get a list of commands or see how to use them.\n**${prefix}info** - When using this command you will recieve a list of bot information.\n**${prefix}leaderboard** - This command allows you to view a leaderbord of levels of a server.\n**${prefix}online** -  This will display the amount of users on the guild with every presence.\n**${prefix}ping** - When using this command you will recieve your ping.\n**${prefix}serverinfo** - When you use this command, you can see a list of information about the server.\n**${prefix}uptime ** - When using this command, the current online time of the bot is displayed.\n**${prefix}userinfo** - When you use this command you get a list of information about a user.\n**${prefix}prefix** - Get the server prefix.\n**${prefix}stats** - View the discord bot stats and hardware.\n**${prefix}rank** - Get your current amount of levels and XP points.`)
const musicEmbed = new Discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Music Commands")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setDescription(`These commands are all commands related to music.\n\n**${prefix}autoplay** - By using this command you can toggle wether or not songs should automaticaly play.\n**${prefix}nowplaying** - This command displays the song that is currently playing.\n**${prefix}pause** - When using this command you will pause the currently playing song.\n**${prefix}play** - Play a song to your liking.\n**${prefix}queue** - View the current queue of songs.\n**${prefix}repeat** - Toggle if songs should repeat or not.\n**${prefix}resume** - Contiune to play music if it's been previously stopped.\n**${prefix}seek** - Go to a specific point in th currently playing song.\n**${prefix}shuffle** - Shuffle the queue to a new order.\n**${prefix}skip** - Skip the currently playing song and go to the next one.\n**${prefix}status** - Get the status of the bot (music related (volume etc.)).\n**${prefix}stop** - Stop the queue and the playing of the current song.\n**${prefix}volume** - Change the volume of the currently playing music.\n**${prefix}join** - Make quabot join your voice channel.`)
const miscEmbed = new Discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Misc Commands")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setDescription(`These commands are just general commands that dont fit the descrition of the ones above.\n**${prefix}avatar** - By using this command you will be able to view either your own profile picture or another users'\n**${prefix}members** - When you use this command you will see the amount of members on a server.\n**${prefix}nick** - By using this command you'll be able to change your nickname.\n**${prefix}emotes** - !emotes - When using this command you will recieve a list of emotes.`)
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
const toggle = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Levels',
                    description: 'Enable or disable the levels system.',
                    value: 'levels_toggle',
                },
            ]),
    );
const moderationEmbed = new Discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Moderation Commands")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setDescription(`These commands are used to punish users and moderate the server.\n\n**${prefix}ban** - This command allows you to permanently ban a user from the guild your in.\n**${prefix}kick** - This command allows you to kick a user from the guild your in.\n**${prefix}mute** - By using this command you will be able to mute any user in your guild.\n**${prefix}tempban** - By using this command you can ban a user for a specified amount of time.\n**${prefix}tempmute** - By using this command you can mute a user for a specified amount of time.\n**${prefix}unban** - By using this command you can unban any user using their user-id.\n**${prefix}unmute** - You can unmute any person on your guild.\n**${prefix}warn** - Warn a specified user with a custom reason.\n**${prefix}punsihments** - View your punishments.\n**${prefix}clearpunishments** - Clear a users's punishments (or just one).`);
const managementEmbed = new Discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Management Commands")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setDescription(`These commands are used by managers to clear channels, start giveaways and more.\n\n**${prefix}clear** - By using this command you can delete a large amount of messages at once.\n**${prefix}config** - Change server settings.\n**${prefix}end** - When you use thins command correctly you will force-end a running giveaway.\n**${prefix}giveaway** - By using this command you will be able to start a giveaway.\n**${prefix}lockdown** - By using this command you will lockdown a channel to stop members from sending messages.\n**${prefix}reroll** - When using this command you can pick a new winner for a giveaway.`)
const toggleEmbed = new Discord.MessageEmbed()
    .setTitle("Toggle Features")
    .setDescription("Use the dropdown to select a setting you wish to change!")
    .setColor(colors.COLOR)
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
const toggleLevels = new Discord.MessageEmbed()
    .setTitle("Toggle Levels")
    .setDescription("Use the buttons to enable/disable the levels system.")
    .addField("Current value", "[CURRENT VALUE]")
    .setFooter("You have 15 seconds to press the buttons.")
    .setColor(colors.COLOR)
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
const levelsDisabled = new Discord.MessageEmbed()
    .setTitle("Disabled Level System")
    .setColor(colors.COLOR)
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
const levelsEnabled = new Discord.MessageEmbed()
    .setTitle("Disabled Level System")
    .setColor(colors.COLOR)
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
const levelsButtons = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageButton()
        .setCustomId('enableLevel')
        .setLabel('Enable')
        .setStyle('SUCCESS'),
        new Discord.MessageButton()
        .setCustomId('disableLevel')
        .setLabel('Disable')
        .setStyle('DANGER'),
    );
const disabledToggle = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageButton()
        .setCustomId('enableLevel')
        .setLabel('Enable')
        .setDisabled('true')
        .setStyle('SUCCESS'),
        new Discord.MessageButton()
        .setCustomId('disableLevel')
        .setLabel('Disable')
        .setDisabled('true')
        .setStyle('DANGER'),
    );
client.on("interactionCreate", async (interaction) => {
    if (interaction.isSelectMenu()) {
        if(interaction.values[0] === "fun_commands") {
            interaction.reply({ embeds: [funEmbed] })
        }
        if(interaction.values[0] === "info_commands") {
            interaction.reply({ embeds: [infoEmbed] })
        }
        if(interaction.values[0] === "music_commands") {
            interaction.reply({ embeds: [musicEmbed] })
        }
        if(interaction.values[0] === "mod_commands") {
            interaction.reply({ embeds: [ModMain], components: [selectMod] });
        }
        if(interaction.values[0] === "moder_commands") {
            interaction.reply({ embeds: [moderationEmbed] });
        }
        if(interaction.values[0] === "mang_commands") {
            interaction.reply({ embeds: [managementEmbed] });
        }
        if(interaction.values[0] === "misc_commands") {
            interaction.reply({ embeds: [miscEmbed] })
        }
        if(interaction.values[0] === "toggle_features") {
            interaction.reply({ embeds: [toggleEmbed], components: [toggle], ephemeral: true })
        }
        if(interaction.values[0] === "levels_toggle") {
            interaction.reply({ ephemeral: true, embeds: [toggleLevels], components: [levelsButtons] })
        }
    }
    if (interaction.isButton()) {
        const filter = i => i.customId === 'enableLevel' || i.customId === 'disableLevel';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
        collector.on('collect', async i => {
            if (i.customId === 'enableLevel') {
                await i.update({ ephemeral: true, embeds: [levelsEnabled], components: [disabledToggle] });
            }
            if (i.customId === 'disableLevel') {
                await i.update({ ephemeral: true, embeds: [levelsDisabled], components: [disabledToggle] });
            }
        });

    }
});

Levels.setURL("mongodb+srv://admin:AbyUoKpaaWrjK@cluster.n4eqp.mongodb.net/Database?retryWrites=true&w=majority");
client.mongoose.init();
console.log("Loaded index.js")
client.login(config.BOT_TOKEN);
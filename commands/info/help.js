const discord = require('discord.js');
const prefix = "!";
const colors = require('../../files/colors.json');

const mainHelp = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle(`Use **${prefix}help [category]** to get detailed command list.`)
    .setThumbnail("https://i.imgur.com/8HHHGK1.png")
    .addField("Fun Commands", "These commands give funny pictures, games and more.")
    .addField("Moderation Commands", "These commands are used to punish users and moderate the server.")
    .addField("Management Commands", "These commands are used by managers to clear channels, start giveaways and more.")
    .addField("Info Commmands", "These commands are used to get information about loads of different things.")
    .addField("Misc Commands", "These commands are just general commands that dont fit the descrition of the ones above.")
    .addField("Music Commands", "These commands allow you to play music in your voice channel using youtube videos.")
const funEmbed = new discord.MessageEmbed() // DONE
    .setColor(colors.COLOR)
    .setTitle("Fun Commands")
    .setThumbnail("https://i.imgur.com/8HHHGK1.png")
    .setDescription(`These commands give funny pictures, games and more.\n\n**${prefix}coin** - When using this command you will flip a virtual coin.\n**${prefix}cat** - When you use this command you will recieve a cute picture of a cat.\n**${prefix}dog** - By using this command you recieve picture of a dog.\n**${prefix}meme** - When you use this command you get a random meme from a subreddit.\n**${prefix}rps** - With this command you can play rock, paper, scissors with the bot.\n**${prefix}type** - Play a game that makes you type words/sentences in 15 seconds.`)
const moderationEmbed = new discord.MessageEmbed() // DONE
    .setColor(colors.COLOR)
    .setTitle("Moderation Commands")
    .setThumbnail("https://i.imgur.com/8HHHGK1.png")
    .setDescription(`These commands are used to punish users and moderate the server.\n\n**${prefix}ban** - This command allows you to permanently ban a user from the guild your in.\n**${prefix}kick** - This command allows you to kick a user from the guild your in.\n**${prefix}mute** - By using this command you will be able to mute any user in your guild.\n**${prefix}tempban** - By using this command you can ban a user for a specified amount of time.\n**${prefix}tempmute** - By using this command you can mute a user for a specified amount of time.\n**${prefix}unban** - By using this command you can unban any user using their user-id.\n**${prefix}unmute** - You can unmute any person on your guild.\n**${prefix}warn** - Warn a specified user with a custom reason.\n**${prefix}punsihments** - View your punishments.\n**${prefix}clearpunishments** - Clear a users's punishments (or just one).`);
const managementEmbed = new discord.MessageEmbed() // DONE
    .setColor(colors.COLOR)
    .setTitle("Management Commands")
    .setThumbnail("https://i.imgur.com/8HHHGK1.png")
    .setDescription(`These commands are used by managers to clear channels, start giveaways and more.\n\n**${prefix}clear** - By using this command you can delete a large amount of messages at once.\n**${prefix}config** - Change server settings.\n**${prefix}end** - When you use thins command correctly you will force-end a running giveaway.\n**${prefix}giveaway** - By using this command you will be able to start a giveaway.\n**${prefix}lockdown** - By using this command you will lockdown a channel to stop members from sending messages.\n**${prefix}reroll** - When using this command you can pick a new winner for a giveaway.`)
const infoEmbed = new discord.MessageEmbed() // DONE
    .setColor(colors.COLOR)
    .setTitle("Info Commands")
    .setThumbnail("https://i.imgur.com/8HHHGK1.png")
    .setDescription(`These commands are used to get information about loads of different things.\n\n**${prefix}server** - By using this command you get the server name.\n**${prefix}donate** - This command is used to get info about donations to quabot.\n**${prefix}help** - By using this command you will get a list of commands or see how to use them.\n**${prefix}info** - When using this command you will recieve a list of bot information.\n**${prefix}leaderboard** - This command allows you to view a leaderbord of levels of a server.\n**${prefix}online** -  This will display the amount of users on the guild with every presence.\n**${prefix}ping** - When using this command you will recieve your ping.\n**${prefix}serverinfo** - When you use this command, you can see a list of information about the server.\n**${prefix}uptime ** - When using this command, the current online time of the bot is displayed.\n**${prefix}userinfo** - When you use this command you get a list of information about a user.\n**${prefix}prefix** - Get the server prefix.\n**${prefix}stats** - View the discord bot stats and hardware.\n**${prefix}rank** - Get your current amount of levels and XP points.`)
const miscEmbed = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Misc Commands")
    .setThumbnail("https://i.imgur.com/8HHHGK1.png")
    .setDescription(`These commands are just general commands that dont fit the descrition of the ones above.\n**${prefix}avatar** - By using this command you will be able to view either your own profile picture or another users'\n**${prefix}members** - When you use this command you will see the amount of members on a server.\n**${prefix}nick** - By using this command you'll be able to change your nickname.\n**${prefix}emotes** - !emotes - When using this command you will recieve a list of emotes.`)
const musicEmbed = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Music Commands")
    .setThumbnail("https://i.imgur.com/8HHHGK1.png")
    .setDescription(`These commands are all commands related to music.\n\n**${prefix}autoplay** - By using this command you can toggle wether or not songs should automaticaly play.\n**${prefix}nowplaying** - This command displays the song that is currently playing.\n**${prefix}pause** - When using this command you will pause the currently playing song.\n**${prefix}play** - Play a song to your liking.\n**${prefix}queue** - View the current queue of songs.\n**${prefix}repeat** - Toggle if songs should repeat or not.\n**${prefix}resume** - Contiune to play music if it's been previously stopped.\n**${prefix}seek** - Go to a specific point in th currently playing song.\n**${prefix}shuffle** - Shuffle the queue to a new order.\n**${prefix}skip** - Skip the currently playing song and go to the next one.\n**${prefix}status** - Get the status of the bot (music related (volume etc.)).\n**${prefix}stop** - Stop the queue and the playing of the current song.\n**${prefix}volume** - Change the volume of the currently playing music.\n**${prefix}join** - Make quabot join your voice channel.`)

module.exports = {
    name: "help",
    aliases: ["support"],
    async execute(client, message, args) {

        console.log("Command `help` was used.");

        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        if (!args[0]) {
            if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
            message.channel.send({ embeds: [mainHelp]});
            return;
        }

        const category = args[0].toLowerCase();

        if (category === "fun") {
            message.channel.send({ embeds: [funEmbed]});
            if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
            return;
        }

        if (category === "moderation") {
            message.channel.send({ embeds: [moderationEmbed]});
            if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
            return;
        }

        if (category === "management") {
            message.channel.send({ embeds: [managementEmbed]});
            if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
            return;
        }

        if(category === "info") {
            message.channel.send({ embeds: [infoEmbed]});
            if(message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
            return;
        }

        if(category === "misc") {
            message.channel.send({ embeds: [miscEmbed]});
            if(message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
            return; 
        }

        if(category === "music") {
            message.channel.send({ embeds: [musicEmbed]});
            if(message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
            return; 
        }

        message.channel.send({ embeds: [mainHelp] });
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
    }
}
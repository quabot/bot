const discord = require('discord.js');
const ms = require('ms');
const Guild = require('../models/guild');
const config = require('../../files/config.json');
const colors = require('../files/colors.json');

const noPermsAdminUser = new discord.MessageEmbed()
    .setDescription("You do not have administrator permissions!")
    .setColor(colors.COLOR)
const errorEmbed = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const noValidChannel = new discord.MessageEmbed()
    .setDescription("Please enter a valid channel for the giveaway to be hosted in!")
    .setColor(colors.COLOR)
const noPermsMsg = new discord.MessageEmbed()
    .setDescription("I do not have permission to manage messages!")
    .setColor(colors.COLOR)
const noTime = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription("Please enter a time for the giveaway to last!")
    const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)
const noWinners = new discord.MessageEmbed()
    .setDescription("Please enter an amount of winners!")
    .setColor(colors.COLOR)
const noPrize = new discord.MessageEmbed()
    .setDescription("Please enter a prize to win!")
    .setColor(colors.COLOR)

module.exports = {
    name: "giveaway",
    aliases: [],
    cooldown: "6",
    async execute(client, message, args) {

        console.log("Command `giveaway` was used.");

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send(noPermsMsg);
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(noPermsAdminUser);

        let giveawayChannel = message.mentions.channels.first();
        if (!giveawayChannel) {
            return message.channel.send(noValidChannel);
        }

        let giveawayDuration = args[1];
        if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
            return message.channel.send(noTime);
        }

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
        const logChannel = message.guild.channels.cache.get(settings.logChannelID);

        let giveawayNumberWinners = args[2];
        if (isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)) {
            return message.channel.send(noWinners);
        }

        let giveawayPrize = args.slice(3).join(' ');
        if (!giveawayPrize) {
            return message.channel.send(noPrize);
        }

        client.giveawaysManager.start(giveawayChannel, {
            time: ms(giveawayDuration),
            prize: giveawayPrize,
            winnerCount: parseInt(giveawayNumberWinners),
            hostedBy: message.author ? message.author : null,
            messages: {
                giveaway: (true ? "@everyone\n\n" : "") + ":tada: **GIVEAWAY** :tada:",
                giveawayEnded: (true ? "@everyone\n\n" : "") + ":tada: **GIVEAWAY ENDED** :tada:",
                timeRemaining: "Time remaining: **{duration}**!",
                inviteToParticipate: "React with 🎉 to participate.",
                winMessage: "Congratulations, {winners}. You won **{prize}**!",
                embedFooter: "Giveaways",
                noWinner: "Not enough participants to get a winner!",
                hostedBy: "Hosted by: {user}",
                winners: "winner(s)",
                endedAt: "Ended at",
                units: {
                    seconds: "seconds",
                    minutes: "minutes",
                    hours: "hours",
                    days: "days",
                    pluralS: false
                }
            }
        });

        message.channel.send(`The giveaway for the \`${giveawayPrize}\` is starting in ${giveawayChannel}.`);

        if (settings.enableLog === "false") {
            return;
        }

        if (settings.enableLog === "true") {
            if (!logChannel) {
                return;
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(colors.GIVEAWAY_COLOR)
                    .setTitle('Giveaway started')
                    .addField('Channel', giveawayChannel)
                    .addField('Prize', giveawayPrize)
                    .addField('Duration', giveawayDuration)
                    .addField('Winners', giveawayNumberWinners)
                return logChannel.send(embed);
            };
        }

    }
}
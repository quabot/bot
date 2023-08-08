const discord = require('discord.js');

const config = require('../../files/config.json')
const Guild = require('../models/guild');
const colors = require('../files/colors.json');

const noPermsAdminUser = new discord.MessageEmbed()
    .setDescription("You do not have administrator permissions.")
    .setColor(colors.COLOR)
const errorEmbed = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const msgIDorPize = new discord.MessageEmbed()
    .setDescription("Please enter the message ID or prize!")
    .setColor(colors.COLOR)
    const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)

module.exports = {
    name: "end",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `end` was used.");

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send(noPermsMsg);
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(noPermsAdminUser);

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

        if (!args[0]) {
            return message.channel.send(msgIDorPize);
        }

        let giveaway =
            client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
            client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

        if (!giveaway) {
            const cantFind = new discord.MessageEmbed()
                .setDescription(`I cannot find giveaway: **${args.join(' ')}**`)
                .setColor(colors.COLOR)
            return message.channel.send(cantFind);
        }
        client.giveawaysManager.edit(giveaway.messageID, {
            setEndTimestamp: Date.now()
        })
            .then(() => {
                const alreadyEnded = new discord.MessageEmbed()
                        .setDescription(`Giveaway will end in less than **${client.giveawaysManager.options.updateCountdownEvery / 1000}** seconds.`)
                        .setColor(colors.COLOR)
                message.channel.send(alreadyEnded);
            })
            .catch((e) => {
                if (e.startsWith(`Giveaway with message ID ${giveaway.messageID} has already ended.`)) {

                    const alreadyEnded = new discord.MessageEmbed()
                        .setDescription(`This giveaway has ended already.`)
                        .setColor(colors.COLOR)
                    message.channel.send(alreadyEnded);

                } else {
                    console.error(e);
                    message.channel.send(errorEmbed);
                }
            });

        if (settings.enableLog === "false") {
            return;
        }

        if (settings.enableLog === "true") {
            if (!logChannel) {
                return;
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(colors.END_COLOR)
                    .setTitle('Giveaway Force Ended')
                    .addField('Giveaway', args.join(' '))
                return logChannel.send(embed);
            };
        }
    }
}
const discord = require('discord.js');
const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');

const noPermsAdminUser = new discord.MessageEmbed()
    .setDescription("You do not have administrator permissions.")
    .setColor(colors.COLOR)
const noPermsMsg = new discord.MessageEmbed()
    .setDescription("I do not have permission to manage messages!")
    .setColor(colors.COLOR)
const noAmountMsg = new discord.MessageEmbed()
    .setDescription("Please enter an amount of messages to be cleared!")
    .setColor(colors.COLOR)
const msg100Max = new discord.MessageEmbed()
    .setDescription("Please enter a value between 0-100!")
    .setColor(colors.COLOR)
const errorMain = new discord.MessageEmbed()
    .setDescription("I cannot delete messages older than 14 days!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)

module.exports = {
    name: "clear",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `clear` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) return message.channel.send({ embeds: [noPermsMsg]});
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [noPermsAdminUser]});

        if (!args) return message.channel.send({ embeds: [noAmountMsg]});
        if (args <= 0) return message.channel.send({ embeds: [msg100Max]});
        if (args >= 101) return message.channel.send({ embeds: [msg100Max]});
        if (isNaN(args)) return message.channel.send({ embeds: [msg100Max]});

        message.channel.bulkDelete(args[0]).catch(err => message.channel.send({ embeds: [errorMain]}));
        const clearedAmount = new discord.MessageEmbed()
            .setDescription(`Succesfully cleared **${args[0]}** messages!`)
            .setColor(colors.COLOR)
        message.channel.send({ embeds: [clearedAmount]});

        // LOGGING
        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) message.channel.send({ embeds: [errorMain]});
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
                    .catch(err => message.channel.send({ embeds: [errorMain]}));

                return message.channel.send({ embeds: [addedDatabase]});
            }
        });

        if (settings.enableLog === "true") {
            const logChannel = message.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;
            const embed = new discord.MessageEmbed()
                .setColor(colors.CLEAR_COLOR)
                .setTitle('Messages Cleared')
                .addField('Channel', message.channel)
                .addField('Amount', args)
            logChannel.send({ embeds: [embed]});
        } else {
            return;
        }

    }
}
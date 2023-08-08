const discord = require('discord.js');
const colors = require('../files/colors.json');
const Guild = require('../models/guild');
const ms = require('ms');

const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)
const noManageChannels = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription("I do not have permission to manage channels!")
const noAdmin = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription("You do not have administrator permissons!")

module.exports = {
    name: "lockdown",
    aliases: ["lock"],
    async execute(client, message, args) {

        console.log("Command `lockdown` was used.");

        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return message.delete({ timeout: 5000 });
        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timout: 5000 });
        if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send(noManageChannels);
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(noAdmin);

        if (!client.lockit) client.lockit = [];
        let time = args.join(' ');
        let validUnlocks = ['release', 'unlock'];
        if (!time) return message.channel.send('You must set a duration for the lockdown in either hours, minutes or seconds.');

        if (validUnlocks.includes(time)) {

            message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
            message.channel.send("Succesfully unlocked channel.");
            clearTimeout(client.lockit[message.channel.id]);
            delete client.lockit[message.channel.id];

        } else {
            message.channel.updateOverwrite(message.guild.id, {
                SEND_MESSAGES: false
            }).then(() => {
                message.channel.send(`**Channel locked** for ${ms(ms(time), { long: true })}.`).then(() => {

                    client.lockit[message.channel.id] = setTimeout(() => {
                        message.channel.updateOverwrite(message.guild.id, {
                            SEND_MESSAGES: null
                        }).then(message.channel.send('**Lockdown lifted.**')).catch(console.error);
                        delete client.lockit[message.channel.id];
                    }, ms(time));

                }).catch(error => {
                    return;
                });
            });
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

        if (settings.enableLog === "true") {
            const logChannel = message.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;

            const embed = new discord.MessageEmbed()
            .setColor(colors.LOCK_COLOR)
            .setTitle('Channel Locked')
            .addField('Channel', message.channel)
            .addField('Time', time)
            logChannel.send(embed);
        } else {
            return;
        }
    }
}
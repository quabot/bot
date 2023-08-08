const discord = require('discord.js');

const colors = require('../files/colors.json');
const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)
const noNewPrefix = new discord.MessageEmbed()
    .setDescription("Please enter a valid new prefix!")
    .setColor(colors.COLOR)
const noNewValue = new discord.MessageEmbed()
    .setDescription("Please enter a valid new value!")
    .setColor(colors.COLOR)
const Guild = require('../models/guild');
const optionsEmbed = new discord.MessageEmbed()
    .setTitle("Quabot configuration")
    .setColor(colors.COLOR)
    .setThumbnail("https://i.imgur.com/8HHHGK1.png")
    .setDescription("Configure quabot to fit for your server.\n")
    .addField("Toggle Settings", "Toggle settings such as levels, music, logging and more.\n**Usage:**  `!config toggle`")
    .addField("Change Channels", "Change the log channel and more soon.\n**Usage:** `!config channel`")
    .addField("Change Prefix", "Change this servers prefix.\n**Usage:** `!config prefix [prefix]`")
    .addField("Change Roles", "Changes roles for mute and unmute commands.\n**Usage:** `!config roles`")
const toggleEmbed = new discord.MessageEmbed()
    .setTitle("Toggle Selection")
    .setColor(colors.COLOR)
    .setThumbnail("https://i.imgur.com/8HHHGK1.png")
    .setDescription("Toggle certain features to enable or disable them.\n")
    .addField("Toggle Levels", "Enable or disable the levels system. This disales all level-related commands and xp gathering.\n**Usage:**  `!config toggle level [true/false]`")
    .addField("Toggle Music", "Enable or disable music. This disables all music related commands.\n**Usage:** `!config toggle music [true/false]`")
    .addField("Toggle Swearfilter", "Enable or disable the message swear filter, this will allow everyone to swear.\n**Usage:** `!config toggle swear [true/false]`")
    .addField("Toggle Logging", "Enable or disable the log channel, this will disable all log messages in the set log channel.\n**Usage:** `!config enable log [true/false]`")

const channelEmbed = new discord.MessageEmbed()
    .setTitle("Change Channels")
    .setColor(colors.COLOR)
    .setThumbnail("https://i.imgur.com/8HHHGK1.png")
    .setDescription("Change channels to send messages in.\n")
    .addField("Log Channel", "Change the log channel. This will send all logging messages to a specific channel.\n**Usage:**  `!config channel log [channel]`")

const roleEmbed = new discord.MessageEmbed()
    .setTitle("Change Roles")
    .setColor(colors.COLOR)
    .setThumbnail("https://i.imgur.com/8HHHGK1.png")
    .setDescription("Change roles for some commands (mute/unmute).\n")
    .addField("Muted Role Name", "Change the muted role. This will change the name of role you get when muted (ex. Muted).\n**Usage:**  `!config roles muted [name]`")
    .addField("Main Role Name", "Change the main role. This will change the name of this servers main role (ex. Member).\n**Usage:** `!config roles main [name]`");


// LOGGING

module.exports = {
    name: "config",
    aliases: ["settings"],
    async execute(client, message, args) {

        console.log("Command `config` was used.");

        const a0 = args[0];
        const a1 = args[1];
        const a2 = args[2];

        const channel = message.mentions.channels.first();

        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

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

        if (!a0) return message.channel.send(optionsEmbed);

        if (a0 === "prefix") {
            if (!a1) return message.channel.send(noNewPrefix);
            await settings.updateOne({
                prefix: a1
            });

            const newPrefix = new discord.MessageEmbed()
                .setDescription(`Succesfully updated server prefix to **${a1}**`)
                .setColor(colors.COLOR)
            message.channel.send(newPrefix);
            if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 50000 });
        }

        if (a0 === "channel") {
            if (!a1) return message.channel.send(channelEmbed);

            if (a1 === "log") {
                if (!channel) return message.channel.send(noNewValue);

                await settings.updateOne({
                    logChannelID: channel.id
                });
                const embed3 = new discord.MessageEmbed()
                    .setColor(colors.COLOR)
                    .setDescription(`Log channel ID is now: **${channel.id}**!`)
                message.channel.send(embed3);
                if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 50000 });
                return;
            }

            message.channel.send(channelEmbed);
        }

        if (a0 === "toggle") {
            if (!a1) return message.channel.send(toggleEmbed);
            if (a1 === "level") {
                if (!a2) return message.channel.send(noNewValue);

                if (a2 === "false" || a2 === "true") {

                    await settings.updateOne({
                        enableLevel: a2
                    });

                    const embed = new discord.MessageEmbed()
                        .setColor(colors.COLOR)
                        .setDescription(`Level system enabled is now: **${a2}**!`)
                    message.channel.send(embed);
                    if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 50000 });
                    return;
                } else {
                    message.channel.send(noNewValue);
                }
                if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 50000 });
            }

            if (a1 === "music") {
                if (!a2) return message.channel.send(noNewValue);

                if (a2 === "false" || a2 === "true") {

                    await settings.updateOne({
                        enableMusic: a2
                    });

                    const embed1 = new discord.MessageEmbed()
                        .setColor(colors.COLOR)
                        .setDescription(`Music enabled is now: **${a2}**!`)
                    message.channel.send(embed1);
                    if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 50000 });
                    return;
                } else {
                    message.channel.send(noNewValue);
                }
                if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 50000 });
            }

            if (a1 === "swear") {
                if (!a2) return message.channel.send(noNewValue);

                if (a2 === "false" || a2 === "true") {

                    await settings.updateOne({
                        enableSwearFilter: a2
                    });

                    const embed2 = new discord.MessageEmbed()
                        .setColor(colors.COLOR)
                        .setDescription(`Swear filter enabled is now: **${a2}**!`)
                    message.channel.send(embed2);
                    if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 50000 });
                    return;
                } else {
                    message.channel.send(noNewValue);
                }
            }

            if (a1 === "log") {
                if (!a2) return message.channel.send(noNewValue);

                if (a2 === "false" || a2 === "true") {

                    await settings.updateOne({
                        enableLog: a2
                    });

                    const embed2 = new discord.MessageEmbed()
                        .setColor(colors.COLOR)
                        .setDescription(`Log channel enabled is now: **${a2}**!`)
                    message.channel.send(embed2);
                    if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 50000 });
                    return;
                } else {
                    message.channel.send(noNewValue);
                }
            }

            message.channel.send(toggleEmbed);
        }

        if (a0 === "roles") {
            if (!a1) return message.channel.send(roleEmbed);
            if (a1 === "muted") {
                if (!a2) return message.channel.send(noNewValue);
                await settings.updateOne({
                    mutedRoleName: a2
                });

                const embed49 = new discord.MessageEmbed()
                    .setColor(colors.COLOR)
                    .setDescription(`This servers muted role name is now: **${a2}**!`)
                message.channel.send(embed49);
                if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 50000 });
                return;
            }
            if (a1 === "main") {
                if (!a2) return message.channel.send(noNewValue);
                await settings.updateOne({
                    mainRoleName: a2
                });

                const embed49 = new discord.MessageEmbed()
                    .setColor(colors.COLOR)
                    .setDescription(`This servers main role name is now: **${a2}**!`)
                message.channel.send(embed49);
                if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 50000 });
                return;
            }
            if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 50000 });
        }
    }
}

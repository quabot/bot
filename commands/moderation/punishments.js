const discord = require('discord.js');
const mongoose = require('mongoose');
const User = require('../../models/user');
const colors = require('../files/colors.json');

const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)
const noPermsOtherUsers = new discord.MessageEmbed()
    .setDescription("You do not have permission to view punishments of other users!")
    .setColor(colors.COLOR)

    module.exports = {
    name: "punishments",
    aliases: ["warncount", "mutecount", "bancount", "kickcount"],
    cooldown: "5",
    async execute(client, message, args) {

        console.log("Command `punishments` was used.");

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

        let member = message.author;
        if (!message.member.permissions.has("BAN_MEMBERS")) {
            return message.channel.send(noPermsOtherUsers);
            let member = message.mentions.users.first();
        }


        const punishments = await User.findOne({
            guildID: message.guild.id,
            userID: member.id
        }, async (err, user) => {
            if (err) console.error(err);
            if (!user) {
                const newUser = new User({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    userID: member.id,
                    muteCount: 0,
                    warnCount: 0,
                    kickCount: 0,
                    banCount: 0
                });

                await newUser.save()
                return message.channel.send(addedDatabase)
                    .catch(err => message.reply(errorMain));

            }
        });

        const embed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setTitle(`Punishments for ${member.tag}`)
            .addField("Mute count", punishments.muteCount)
            .addField("Warn count", punishments.warnCount)
            .addField("Kick count", punishments.kickCount)
            .addField("Ban count", punishments.banCount)
        message.channel.send(embed)
    }
}


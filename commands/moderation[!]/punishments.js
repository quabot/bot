const discord = require('discord.js');
const mongoose = require('mongoose');
const User = require('../../models/user');
const colors = require('../../files/colors.json');
const {errorMain, addedDatabase, PunsishmentsOthers} = require('../../files/embeds');

    module.exports = {
    name: "punishments",
    aliases: ["warncount", "mutecount", "bancount", "kickcount", "devpun"],
    cooldown: "5",
    async execute(client, message, args) {

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        let member = message.mentions.users.first() || message.author;
        if (!message.member.permissions.has("BAN_MEMBERS")) {
            return message.channel.send({embeds: [PunsishmentsOthers]});
        }

        const punishments = await User.findOne({
            guildID: message.guild.id,
            userID: member.id
        }, async (err, User) => {
            if (err) message.channel.send({embeds: [errorMain]});
            if (!User) {
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
                return message.channel.send({embeds: [addedDatabase]})
                    .catch(err => message.reply({embeds: [errorMain]}));

            }
        });

        const embed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setTitle(`Punishments for ${member.tag}`)
            .addField("Mute count", `${punishments.muteCount}`)
            .addField("Warn count", `${punishments.warnCount}`)
            .addField("Kick count", `${punishments.kickCount}`)
            .addField("Ban count", `${punishments.banCount}`)
        message.channel.send({embeds: [embed]});
    }
}


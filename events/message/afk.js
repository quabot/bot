const Discord = require('discord.js');
const mongoose = require('mongoose');
const prefix = "!";
const Levels = require('discord.js-leveling');
const DisTube = require('distube');
const consola = require('consola');
const { Commands } = require("../../validation/commandnames");

const config = require('../../files/config.json');
const swearwords = require("../../files/data.json");
const colors = require('../../files/colors.json');

const { errorMain, addedDatabase } = require('../../files/embeds');
const { addbot } = require('../../files/interactions.js');

module.exports = {
    name: "messageCreate",
    async execute(message, args, client) {

        if (message.guild === null) {
            return;
        }

        try {

            if (message.author.bot) return;

            const user = message.mentions.users.first();
            if (!user) return;

            const User = require('../../schemas/UserSchema');
            const userDatabase = await User.findOne({
                userId: user.id,
                guildId: message.guild.id,
            }, (err, user) => {
                if (err) console.error(err);
                if (!user) {
                    const newUser = new User({
                        userId: user.id,
                        guildId: message.guild.id,
                        guildName: message.guild.name,
                        typeScore: 0,
                        kickCount: 0,
                        banCount: 0,
                        warnCount: 0,
                        muteCount: 0,
                        afk: false,
                        afkStatus: "none",
                    });
                    newUser.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [errorMain] });
                        });
                }
            });

            if (userDatabase.afk === true) {
                if (user === message.author) {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`Removing your afk status!`)
                        .setColor(colors.COLOR)
                    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
                    await userDatabase.updateOne({
                        afk: false
                    });
                    return;
                }
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${user} is afk!`)
                    .setColor(colors.COLOR)
                if (userDatabase.afkStatus !== "none") {
                    embed.setDescription(`${user} is afk: **${userDatabase.afkStatus}**`)
                }
                message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }});
                return;
            }

        } catch (e) {
            return;
        }
    }
}
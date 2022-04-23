const { commands } = require('../../../index');
const { Client, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "messageReactionAdd",
    async execute(reaction, user, client) {

        if (reaction.message.guildId === null) return;

        try {
            if (user.bot) return;
            const React = require('../../schemas/ReactSchema');
            const reactList = await React.findOne({
                guildId: reaction.message.guildId,
                messageId: reaction.message.id,
                emoji: reaction._emoji.name,
            }, (err, react) => {
                if (err) console.error(err);
                if (!react) {
                    return;
                }
                return;
            }).clone().catch(function (err) { console.log(err) });
            if (!reactList) return;

            let emojiRole = reaction.message.guild.roles.cache.find(role => role.id === `${reactList.role}`);
            if (!emojiRole) {
                const noRole = new MessageEmbed()
                    .setTitle(":x: No Role!")
                    .setDescription(`Could not find a role with the id **${reactList.role}**! Deleted this reaction role.`)
                    .setColor(COLOR_MAIN)
                    
                reaction.message.reply({ ephemeral: true, embeds: [noRole] });
                React.deleteOne({
                    guildId: reaction.message.guildId,
                    messageId: reaction.message.id,
                    emoji: reaction._emoji.name,
                }, (err) => {
                    if (err) return;
                });
                return;
            }

            let memberTarget = reaction.message.guild.members.cache.get(user.id);

            if (reactList.reactMode === "normal") {
                memberTarget.roles.add(emojiRole).catch(err => {
                    return;
                })
            } else if (reactList.reactMode === "verify") {
                memberTarget.roles.add(emojiRole).catch(err => {
                    return;
                })
            } else if (reactList.reactMode === "drop") {
                memberTarget.roles.remove(emojiRole).catch(err => {
                    return;
                })
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
}
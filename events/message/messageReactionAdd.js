const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "messageReactionAdd",
    /**
     * @param {Client} client 
     */
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
            });
            if (!reactList) return;

            let emojiRole = reaction.message.guild.roles.cache.find(role => role.id === `${reactList.role}`);
            if (!emojiRole) {
                const noRole = new Discord.MessageEmbed()
                    .setTitle(":x: No Role!")
                    .setDescription(`Could not find a role with the id **${reactList.role}**!`)
                    .setColor(colors.COLOR)
                    .setTimestamp()
                reaction.message.reply({ embeds: [noRole] });
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
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Role given!`)
                    .setDescription(`You were given the **${emojiRole.name}** role in **${reaction.message.guild.name}**!`)
                    .setFooter("Remove your reaction to get rid of the role.")
                    .setTimestamp()
                    .setColor(colors.COLOR)
                memberTarget.send({ embeds: [embed] }).catch(err => {
                    return;
                });;
                memberTarget.roles.add(emojiRole)
            } else if (reactList.reactMode === "verify") {
                const embed2 = new Discord.MessageEmbed()
                    .setTitle(`Role given!`)
                    .setDescription(`You were given the **${emojiRole.name}** role in **${reaction.message.guild.name}**!`)
                    .setFooter("You cannot remove this role.")
                    .setTimestamp()
                    .setColor(colors.COLOR)
                memberTarget.send({ embeds: [embed2] }).catch(err => {
                    return;
                });
                memberTarget.roles.add(emojiRole)
            } else if (reactList.reactMode === "drop") {
                const embed3 = new Discord.MessageEmbed()
                    .setTitle(`Role removed!`)
                    .setDescription(`You were removed from the **${emojiRole.name}** role in **${reaction.message.guild.name}**!`)
                    .setFooter("You can only remove this role.")
                    .setTimestamp()
                    .setColor(colors.COLOR)
                memberTarget.roles.remove(emojiRole)
                memberTarget.send({ embeds: [embed3] }).catch(err => {
                    return;
                });
            }
        } catch (e) {
            console.log(e);
            return;
        }

    }
}
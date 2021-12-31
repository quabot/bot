const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "messageReactionRemove",
    /**
     * @param {Client} client 
     */
    async execute(reaction, user, client) {

        if (reaction.message.guildId === null) return;

        try {
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
                    .setTitle(`Role remove!`)
                    .setDescription(`You were removed the **${emojiRole.name}** role in **${reaction.message.guild.name}**!`)
                    .setFooter("React again to get the role again.")
                    .setTimestamp()
                    .setColor(colors.COLOR)
                memberTarget.send({ embeds: [embed] }).catch(err => {
                    return;
                });;
                memberTarget.roles.remove(emojiRole)
            } else if (reactList.reactMode === "verify") {
                const embed2 = new Discord.MessageEmbed()
                    .setTitle(`Error!!`)
                    .setDescription(`You cannot remove the **${emojiRole.name}** role in **${reaction.message.guild.name}**!`)
                    .setFooter("You cannot remove this role, as this is a verify mode role.")
                    .setTimestamp()
                    .setColor(colors.COLOR)
                memberTarget.send({ embeds: [embed2] }).catch(err => {
                    return;
                });;
            }
        } catch (e) {
            console.log(e);
            return;
        }

    }
}
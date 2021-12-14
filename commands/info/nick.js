const discord = require('discord.js');
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const config = require('../../files/config.json');
const { errorMain, iNoPerms, tooLong } = require('../../files/embeds');

module.exports = {
    name: "nick",
    description: "Change nicknames.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "new-nick",
            description: "New nickname",
            type: "STRING",
            required: true,
        },
        {
            name: "user",
            description: "User to change the nickname of",
            type: "USER"
        },
    ],
    async execute(client, interaction) {

        try {
            const member = interaction.member;
            const newNick = interaction.options.getString('new-nick');
            if (newNick.length > 32) return interaction.reply({ embeds: [tooLong] });
            const user = interaction.options.getMember('user');
            if (member.permissions.has("MANAGE_NICKNAMES")) {
                if (user) {
                    if (user.permissions.has('ADMINISTRATOR')) return interaction.reply({ embeds: [iNoPerms] });
                    user.setNickname(`${newNick}`);
                    const embed = new discord.MessageEmbed()
                        .setTitle(":white_check_mark: Changed nickname!")
                        .setDescription(`Changed ${user}'s nickname to **${newNick}**.`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] });
                } else {
                    if (member.permissions.has('ADMINISTRATOR')) return interaction.reply({ embeds: [iNoPerms] });
                    member.setNickname(`${newNick}`);
                    const embed = new discord.MessageEmbed()
                        .setTitle(":white_check_mark: Changed nickname!")
                        .setDescription(`Changed your nickname to **${newNick}**.`)
                        .setColor(colors.COLOR)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] });
                }
            } else {
                if (member.permissions.has('ADMINISTRATOR')) return interaction.reply({ embeds: [iNoPerms] });
                member.setNickname(`${newNick}`);
                const embed = new discord.MessageEmbed()
                    .setTitle(":white_check_mark: Changed nickname!")
                    .setDescription(`Changed your nickname to **${newNick}**.`)
                    .setColor(colors.COLOR)
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            }
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}
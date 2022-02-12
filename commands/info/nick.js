const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { nickLength, nickNoPerms } = require('../../embeds/info');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "nick",
    description: "Change nicknames.",
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
            const user = interaction.options.getMember('user');
            const newNick = interaction.options.getString('new-nick');
            if (newNick.length > 32) return interaction.reply({ embeds: [nickLength] }).catch(err => console.log("Error!"));

            if (member.permissions.has("MANAGE_NICKNAMES")) {
                if (user) {
                    if (user.permissions.has('ADMINISTRATOR')) return interaction.reply({ embeds: [nickNoPerms] }).catch(err => console.log("Error!"));;
                    user.setNickname(`${newNick}`);
                    const embed = new MessageEmbed()
                        .setTitle(":white_check_mark: Changed nickname!")
                        .setDescription(`Changed ${user}'s nickname to **${newNick}**.`)
                        .setColor(COLOR_MAIN)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] }).catch(err => console.log("Error!"));
                } else {
                    if (member.permissions.has('ADMINISTRATOR')) return interaction.reply({ embeds: [nickNoPerms] }).catch(err => console.log("Error!"));
                    member.setNickname(`${newNick}`);
                    const embed = new MessageEmbed()
                        .setTitle(":white_check_mark: Changed nickname!")
                        .setDescription(`Changed your nickname to **${newNick}**.`)
                        .setColor(COLOR_MAIN)
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] }).catch(err => console.log("Error!"));
                }
            } else {
                if (member.permissions.has('ADMINISTRATOR')) return interaction.reply({ embeds: [nickNoPerms] });
                member.setNickname(`${newNick}`);
                const embed = new MessageEmbed()
                    .setTitle(":white_check_mark: Changed nickname!")
                    .setDescription(`Changed your nickname to **${newNick}**.`)
                    .setColor(COLOR_MAIN)
                    .setTimestamp();
                interaction.reply({ embeds: [embed] }).catch(err => console.log("Error!"));
            }
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: nick`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}
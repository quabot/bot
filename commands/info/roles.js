const { MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');
const { error, added } = require('../../embeds/general');

module.exports = {
    name: "roles",
    description: "List of roles in this guild.",
    async execute(client, interaction) {
        try {
            const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
            const embed = new MessageEmbed().setTitle(`${interaction.guild.name} roles`).setThumbnail(interaction.guild.iconURL({ dynamic: true })).setColor(COLOR_MAIN);

            if (roles.join(', ').length > 1024) {
                const half = Math.ceil(roles.length / 2);
                let firstHalf = roles.splice(0, half);
                let secondHalf = roles.splice(-half);

                if (firstHalf.join(', ').length > 1024) {
                    const half = Math.ceil(firstHalf.length / 2);
                    let firstHalfPt2 = firstHalf.splice(0, half);
                    let secondHalfPt2 = firstHalf.splice(-half);
                    const half2 = Math.ceil(secondHalf.length / 2);
                    let firstHalfPt3 = secondHalf.splice(0, half2);
                    let secondHalfPt4 = secondHalf.splice(-half2);
                    embed.addField("Roles", `${firstHalfPt2.join(', ')}`);
                    embed.addField("** **", `${secondHalfPt2.join(', ')}`);
                    embed.addField("", `${firstHalfPt3.join(', ')}`);
                    embed.addField("** **", `${secondHalfPt4.join(', ')}`);
                    interaction.reply({ embeds: [embed], split: true }).catch(err => console.log("Error!"));
                    return;
                }
                embed.addField("Roles", `${firstHalf.join(', ')}`);
                embed.addField("** **", `${secondHalf.join(', ')}`);
            } else embed.addField("Roles", `${roles.join(', ')}`);

            interaction.reply({ embeds: [embed], split: true }).catch(err => console.log("Error!"));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: roles`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}
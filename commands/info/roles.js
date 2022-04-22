const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "roles",
    description: 'Server\'s roles.',
    async execute(client, interaction, color) {
        try {
            const embed = new MessageEmbed()
                .setColor(color)

            const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());

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
                    embed.addField("Roles <:RolesIcon:959764812068450318>", `${firstHalfPt2.join(', ')}`);
                    embed.addField("** **", `${secondHalfPt2.join(', ')}`);
                    embed.addField("** **", `${firstHalfPt3.join(', ')}`);
                    embed.addField("** **", `${secondHalfPt4.join(', ')}`);
                    interaction.reply({ embeds: [embed], split: true }).catch(err => console.log(err));
                    return;
                }
                embed.addField("Roles <:RolesIcon:959764812068450318>", `${firstHalf.join(', ')}`);
                embed.addField("** **", `${secondHalf.join(', ')}`);
            } else embed.addField("Roles <:RolesIcon:959764812068450318>", `${roles.join(', ')}`);

            interaction.reply({
                embeds: [embed]
            }).catch(err => console.log(err));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
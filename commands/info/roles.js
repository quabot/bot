const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "roles",
    description: 'Server\'s roles.',
    async execute(client, interaction, color) {
        try {

            // create the embed and fetch the roles.
            const embed = new MessageEmbed()
                .setColor(color)

            const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());

            // fail saves to prevent the roles getting too long.
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
                    interaction.reply({ embeds: [embed], split: true }).catch(( err => { } ))
                    return;
                }
                embed.addField("Roles <:RolesIcon:959764812068450318>", `${firstHalf.join(', ')}`);
                embed.addField("** **", `${secondHalf.join(', ')}`);
            } else embed.addField("Roles <:RolesIcon:959764812068450318>", `${roles.join(', ')}`);

            // send the embed
            interaction.reply({
                embeds: [embed]
            }).catch(( err => { } ))

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
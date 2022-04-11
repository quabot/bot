const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "members",
    description: 'Membercount of the server.',
    async execute(client, interaction, color) {
        try {

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle(`${interaction.guild.name}`)
                        .setDescription(`${interaction.guild.memberCount} members.`)
                        .setImage(interaction.guild.iconURL({ dynamic: true }))
                        .setColor(color)
                    ]
                }).catch(err => console.log(err));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
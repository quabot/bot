const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "servericon",
    description: 'Guild\'s icon.',
    async execute(client, interaction, color) {
        try {

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setImage(interaction.guild.iconURL({ dynamic: true }))
                        .setTitle(`${interaction.guild.name}`)
                        .setColor(color)
                ]
            }).catch(err => console.log(err));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
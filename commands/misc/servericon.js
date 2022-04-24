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
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: "dashboard",
    description: 'Link to our dashboard.',
    async execute(client, interaction, color) {
        try {

            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`You can find our [dashboard](http://localhost:3000) at [dashboard.quabot.net](http://localhost:3000).`)
                        .setColor(color)
                ], ephemeral: false
            }).catch((err) => { });

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
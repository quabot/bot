const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "credits",
    description: 'View QuaBot\'s credits',
    async execute(client, interaction, color) {
        try {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Credits')
                    .setDescription('Thanks to the people below for helping us make QuaBot a reality.')
                    .addField('Joa_sss#0001', 'Owner, Developer')
                    .addField('foxl#3260', 'Developer')
                    .addField('Duckie#4174', 'Developer')
                    .addField('Dolentec#3474', 'Tester, Helper')
                    .addField('PizzaPuntThomas#4997', 'Tester, Helper')
                    .setFooter({text:'Thanks for using QuaBot!'})
                    .setColor(color)
                ]
            });
        }
        catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
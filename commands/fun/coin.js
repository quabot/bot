const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "coin",
    description: "Flip a coin.",
    async execute(client, interaction, color) {
        try {
            const options = ['Heads', 'Tails'];
            const flip = options[Math.floor(Math.random() * options.length)];
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`🪙 ${flip}!`)
                        .setColor(color)
                ]
            }).catch(err => console.log(err));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "coin",
    command: "games",
    async execute(client, interaction, color) {

        const options = ['Heads', 'Tails'];
        const flip = options[Math.floor(Math.random() * options.length)];

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`🪙 ${flip}!`)
                    .setColor(color)
            ]
        }).catch((err => { }));

    }
}
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "random",
    description: 'Roll a random number between two integers.',
    options: [
        {
            name: "min",
            description: "The minimum number QuaBot should return.",
            type: "INTEGER",
            required: true,
        },
        {
            name: "max",
            description: "The maximum number QuaBot should return.",
            type: "INTEGER",
            required: true,
        },
        {
            name: "private",
            description: "Should QuaBot announce the result?",
            type: "BOOLEAN",
            required: false,
        }
    ],
    async execute(client, interaction, color) {
        try {
            let min = interaction.options.getInteger('min');
            let max = interaction.options.getInteger('max');
            let public = !interaction.options.getBoolean('private');

            let rmin = Math.ceil(min);
            let rmax = Math.floor(max);
            let result = Math.floor(Math.random() * (rmax - rmin + 1)) + rmin;

            if (public) {
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Yay! Numbers...')
                        .setDescription(`${interaction.user} asked for a random number between *${min}* and *${max}* and got *${result}*`)
                        .setColor(color)
                    ]
                });
            } else {
                return interaction.reply({ content:`Result: *${result}*`, ephemeral: true});
            }
        }
        catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
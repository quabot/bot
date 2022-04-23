const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "avatar",
    description: 'Get a user\'s avatar.',
    options: [
        {
            name: "user",
            description: "Avatar to get.",
            type: "USER",
        }
    ],
    async execute(client, interaction, color) {
        try {

            let user = interaction.options.getUser('user');
            if (!user) user = interaction.user;

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
                        .setTitle(`Avatar of ${user.username}`)
                        .setColor(color)
                    ]
                }).catch(err => console.log(err));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
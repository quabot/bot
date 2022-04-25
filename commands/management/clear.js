const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "clear",
    description: 'Clear an amount of messages.',
    permission: "MANAGE_MESSAGES",
    options: [
        {
            name: "amount",
            description: "The amount of messages you want to clear.",
            type: "INTEGER",
            required: true,
        },
        {
            name: "private",
            description: "Should QuaBot announce that messages have been cleared?",
            type: "BOOLEAN",
            required: false,
        }
    ],
    async execute(client, interaction, color) {
        try {
            let amount = interaction.options.getInteger('amount');
            let public = !interaction.options.getBoolean('private');

            if (amount > 0) {
                const size = await interaction.channel.bulkDelete(amount, true);
                if (public) {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                            .setTitle('Messages purged')
                            .setDescription(`${amount} message(s) were purged from this channel by ${interaction.user}`)
                            .setColor(color)
                        ]
                    });
                } else {
                    return interaction.reply({ content:`Deleted ${amount} messages.`, ephemeral: true});
                }
            } else {
                return interaction.reply({ content:`You can't delete less than 1 message, idiot.`, ephemeral: true});
            }
        }
        catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
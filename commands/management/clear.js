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
            name: "public",
            description: "Should QuaBot announce that messages have been cleared?",
            type: "BOOLEAN",
            required: true,
        }
    ],
    async execute(client, interaction, color) {
        try {
            let amount = interaction.options.getInteger('amount');
            let public = interaction.options.getBoolean('public');
            
            const size = await interaction.channel.bulkDelete(amount, true);
            if (!public) { return interaction.reply({ content:`Deleted ${amount} messages.`, ephemeral: true}); }
            else if (public) {
                interaction.channel.send({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Messages purged')
                        .setDescription(`${amount} message(s) were purged from this channel by ${interaction.user}`)
                        .setColor(color)
                    ]
                }); return interaction.reply({ content:`Deleted ${amount} messages.`, ephemeral: true});
            }
        }
        catch (e) {
            console.log("Foxl Error! Printed below.");
            console.log(e);
        }
    }
}
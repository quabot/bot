const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "rps",
    description: "Play a game of rock, paper, scissors.",
    async execute(client, interaction, color) {
        try {

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Rock, paper, scissors?`)
                        .setColor(color)
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('rock')
                                .setLabel('🪨 Rock')
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('paper')
                                .setLabel('📃 Paper')
                                .setStyle('SECONDARY'),
                            new MessageButton()
                                .setCustomId('scissors')
                                .setLabel('✂️ Scissors')
                                .setStyle('SUCCESS')
                        )
                ]
            }).catch(err => console.log(err));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
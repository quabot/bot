const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "rps",
    description: "Play a game of rock, paper, scissors.",
    async execute(client, interaction, color) {
        try {

            // Send the rps message.
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
            }).catch(( err => { } ))

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
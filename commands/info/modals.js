const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "modals",
    description: 'modal testing',
    async execute(client, interaction, color) {
        try {
            const { Modal } = require('discord-modals');

            const newModal = new Modal()
                .setCustomId('modal-test')
                .setTitle('QuaBot Modals')
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('modal-test-string')
                        .setLabel('Enter a string')
                        .setStyle('SHORT')
                        .setMinLength(4)
                        .setMaxLength(10)
                        .setPlaceholder('Write a text here')
                        .setRequired(true)
                );

            showModal(newModal, {
                client: client,
                interaction: interaction
            })
        }
        catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
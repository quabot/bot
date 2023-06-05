const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');

module.exports = {
    parent: 'channel',
    name: 'edit',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.options.getChannel('channel');
        const name = interaction.options.getString('name') ?? channel.name;
        const topic = interaction.options.getString('topic') ?? channel.topic;

        await channel.edit({
            name, topic
        }).then(async () => {
            await interaction.editReply({
                embeds: [
                    new Embed(color)
                        .setDescription(`Edit the channel ${channel}.`)
                ]
            });
        }).catch(async (e) => {
            await interaction.editReply({
                embeds: [
                    new Embed(color)
                        .setDescription(`Failed to edit the channel. Error message: ${e.message}.`)
                ]
            });
        });
    }
};

const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');
const ms = require('ms');

module.exports = {
    parent: 'channel',
    name: 'slowmode',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.options.getChannel('channel');
        let slowmode = Math.round(ms(interaction.options.getString('slowmode')) / 1000);

        if (!slowmode)
            return interaction
                .editReply({
                    embeds: [new Embed(color).setDescription('Please give a valid slowmode amount.')],
                })
                .catch(e => { });

        if (slowmode > 21600) slowmode = 21600;
        if (slowmode < 0) slowmode = 0;

        await channel.setRateLimitPerUser(slowmode).then(async () => {
            await interaction.editReply({
                embeds: [
                    new Embed(color)
                        .setDescription(`Updated the channel slowmode.`)
                ]
            });
        }).catch(async (e) => {
            await interaction.editReply({
                embeds: [
                    new Embed(color)
                        .setDescription(`Failed to set the slowmode. Error message: ${e.message}.`)
                ]
            });
        });
    }
};

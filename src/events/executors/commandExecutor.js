const { Interaction, Client, InteractionType, ChannelType, EmbedBuilder, Colors } = require('discord.js');
const { getCustomizationConfig } = require('../../structures/functions/config');
const { permissionBitToString } = require('../../structures/functions/strings');

module.exports = {
    event: 'interactionCreate',
    name: 'commandExecutor',
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (interaction.type !== InteractionType.ApplicationCommand) return;
        if (interaction.isMessageContextMenuCommand()) return;
        if (interaction.isUserContextMenuCommand()) return;
        if (!interaction.guildId) return;
        if (interaction.channel.type === ChannelType.DM || interaction.channel.type === ChannelType.GroupDM) return;

        const command = client.commands.get(interaction.commandName);
        if (!command)
            return (
                interaction
                    .reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Red)
                                .setDescription(
                                    `⛔ An error occured! Couldn't find the command \`${interaction.commandName}\``
                                ),
                        ],
                    })
                    .catch(e => {}) && client.commands.delete(interaction.commandName)
            );

        let color = '#3a5a74';
        const config = await getCustomizationConfig(client, interaction.guildId);
        if (config) color = config.color;
        command.execute(client, interaction, color);
    },
};

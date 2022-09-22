const { Interaction, Client, InteractionType, ChannelType, EmbedBuilder, Colors } = require('discord.js');
const { getCustomizationConfig } = require('../../structures/functions/config');

module.exports = {
    event: "interactionCreate",
    name: "contextExecutor",
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        if (!interaction.guildId) return;
        if (interaction.channel.type === ChannelType.DM || interaction.channel.type === ChannelType.GroupDM) return;
        if (!interaction.isContextMenuCommand()) return;

        const context = client.contexts.get(interaction.commandName);
        if (!context) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`⛔ An error occured! Couldn't find the context \`${interaction.commandName}\``)
            ]
        }).catch((e => { })) && client.contexts.delete(interaction.commandName);

        let color = "#3a5a74";
        const config = await getCustomizationConfig(client, interaction.guildId);
        if (config) color = config.color;
        context.execute(client, interaction, color);
    }
}
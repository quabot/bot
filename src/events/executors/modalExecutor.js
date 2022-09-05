const { Interaction, Client, InteractionType, ChannelType, EmbedBuilder, Colors } = require('discord.js');
const { getCustomizationConfig } = require('../../structures/functions/config');

module.exports = {
    event: "interactionCreate",
    name: "modalExecutor",
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        if (!interaction.type === InteractionType.ModalSubmit) return;
        if (!interaction.guildId) return;
        if (interaction.channel.type === ChannelType.DM || interaction.channel.type === ChannelType.GroupDM) return;

        const modal = client.modals.get(interaction.customId);
        if (!modal) return;

        if (modal.permission) {
            if (!interaction.member.permissions.has(modal.permission)) {
                return interaction.reply({ content: `You do not have the required permissions for this modal: \`${interaction.customId}\`.\nYou need the permission: \`${modal.permission}\` to do that`, ephemeral: true }).catch((e => { }));
            }
        }

        if (modal.permissions) {
            let error = false;
            modal.permissions.forEach(permission => {
                if (!interaction.guild.members.me.permissions.has(permission)) error = true;
                if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(permission)) error = true;
            });

            if (error) return interaction.reply({
                content:
                    `I need the permission(s): \`${modal.permissions.map(i => i)}\` to execute that modal. Double check my permissions for the server and/or this channel.`
                , ephemeral: true
            }).catch((e => { }));
        }

        let color = "#3a5a74";
        const config = await getCustomizationConfig(client, interaction.guildId);
        if (config) color = config.color
        modal.execute(client, interaction, color);
    }
}
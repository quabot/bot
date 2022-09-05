const { Interaction, Client, InteractionType, ChannelType, EmbedBuilder, Colors } = require('discord.js');
const { getCustomizationConfig } = require('../../structures/functions/config');

module.exports = {
    event: "interactionCreate",
    name: "buttonExecutor",
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        if (!interaction.isButton()) return;
        if (!interaction.guildId) return;
        if (interaction.channel.type === ChannelType.DM || interaction.channel.type === ChannelType.GroupDM) return;


        const button = client.buttons.get(interaction.customId);
        if (!button) return;

        if (button.permission) {
            if (!interaction.member.permissions.has(button.permission)) {
                return interaction.reply({ content: `You do not have the required permissions for this button: \`${interaction.customId}\`.\nYou need the permission: \`${button.permission}\` to do that`, ephemeral: true }).catch((err => { }));
            }
        }

        if (button.permissions) {
            let error = false;
            button.permissions.forEach(permission => {
                if (!interaction.guild.members.me.permissions.has(permission)) error = true;
                if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(permission)) error = true;
            });

            if (error) return interaction.reply({
                content:
                    `I need the permission(s): \`${button.permissions.map(i => i)}\` to execute that button. Double check my permissions for the server and/or this channel.`
                , ephemeral: true
            }).catch((err => { }));
        }

        let color = "#3a5a74";
        const config = await getCustomizationConfig(client, interaction.guildId);
        if (config) color = config.color
        button.execute(client, interaction, color);
    }
}
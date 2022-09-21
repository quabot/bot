const { Interaction, Client, InteractionType, ChannelType, EmbedBuilder, Colors } = require('discord.js');
const { getCustomizationConfig } = require('../../structures/functions/config');
const { permissionBitToString } = require('../../structures/functions/strings');

module.exports = {
    event: "interactionCreate",
    name: "commandExecutor",
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        if (interaction.type !== InteractionType.ApplicationCommand) return;
        if (interaction.isMessageContextMenuCommand()) return;
        if (!interaction.guildId) return;
        if (interaction.channel.type === ChannelType.DM || interaction.channel.type === ChannelType.GroupDM) return;


        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`⛔ An error occured! Couldn't find the command \`${interaction.commandName}\``)
            ]
        }).catch((e => { })) && client.commands.delete(interaction.commandName);


        if (command.permission) {
            if (!interaction.member.permissions.has(command.permission)) {
                return interaction.reply({ content: `You do not have the required permissions for this command: \`${interaction.commandName}\`.\nYou need the permission: \`${await permissionBitToString(command.permission)}\` to do that`, ephemeral: true }).catch((e => { }));
            }
        }

        if (command.permissions) {
            let error = false;
            command.permissions.forEach(permission => {
                if (!interaction.guild.members.me.permissions.has(permission)) error = true;
                if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(permission)) error = true;
            });

            if (error) return interaction.reply({
                content:
                    `I need the permission(s): \`${command.permissions.map(i => i)}\` to execute that command. Double check my permissions for the server and/or this channel.`
                , ephemeral: true
            }).catch((e => { }));
        }

        let color = "#3a5a74";
        const config = await getCustomizationConfig(client, interaction.guildId);
        if (config) color = config.color
        command.execute(client, interaction, color);
    }
}
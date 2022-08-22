const { Interaction, Client, InteractionType, ChannelType, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    event: "interactionCreate",
    name: "contextExecutor",
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        if (!interaction.isContextMenuCommand()) return;
        if (!interaction.guildId) return;
        if (interaction.channel.type === ChannelType.DM || interaction.channel.type === ChannelType.GroupDM) return;


        const context = client.contexts.get(interaction.commandName);
        if (!context) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`⛔ An error occured! Couldn't find the context \`${interaction.commandName}\``)
            ]
        }).catch((err => { })) && client.commands.delete(interaction.commandName);


        if (context.permission) {
            if (!interaction.member.permissions.has(context.permission)) {
                return interaction.reply({ content: `You do not have the required permissions for this menu: \`${interaction.commandName}\`.\nYou need the permission: \`${context.permission}\` to do that`, ephemeral: true }).catch((err => { }));
            }
        }

        if (context.permissions) {
            let error = false;
            context.permissions.forEach(permission => {
                if (!interaction.guild.members.me.permissions.has(permission)) error = true;
                if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(permission)) error = true;
            });

            if (error) return interaction.reply({
                content:
                    `I need the permission(s): \`${context.permissions.map(i => i)}\` to execute that menu. Double check my permissions for the server and/or this channel.`
                , ephemeral: true
            }).catch((err => { }));
        }

        command.execute(client, interaction, "#3a5a74");
    }
}
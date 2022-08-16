const { Interaction, Client, InteractionType, ChannelType, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    event: "interactionCreate",
    name: "subcommandExecutor",
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        if (interaction.type !== InteractionType.ApplicationCommand) return;

        if (interaction.channel.type === ChannelType.DM || interaction.channel.type === ChannelType.GroupDM) return;

        try { if (!interaction.options.getSubcommand()) return; } catch (e) { return; }


        const subcommand = client.subcommands.get(`${interaction.options.getSubcommand()}/${interaction.commandName}`);
        if (!subcommand) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`⛔ An error occured! Couldn't find the command \`${interaction.commandName}/${interaction.options.getSubcommand()}\``)
            ]
        }).catch((err => { })) && client.subcommands.delete(`${interaction.options.getSubcommand()}/${interaction.commandName}`);


        if (subcommand.permission) {
            if (!interaction.member.permissions.has(subcommand.permission)) {
                return interaction.reply({ content: `You do not have the required permissions for this subcommand: \`${interaction.commandName}/${subcommand.name}\`.\nYou need the permission: \`${subcommand.permission}\` to do that`, ephemeral: true }).catch((err => { }));
            }
        }

        if (subcommand.permissions) {
            let error = false;
            subcommand.permissions.forEach(permission => {
                if (!interaction.guild.members.me.permissions.has(permission)) error = true;
                if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(permission)) error = true;
            });

            if (error) return interaction.reply({
                content:
                    `I need the permission(s): \`${subcommand.permissions.map(i => i)}\` to execute that command. Double check my permissions for the server and/or this channel.`
                , ephemeral: true
            }).catch((err => { }));
        }


        if (subcommand.command !== interaction.commandName || subcommand.name !== interaction.options.getSubcommand()) return;

        subcommand.execute(client, interaction, "#3a5a74");
    }
}
const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { EmbedBuilder, InteractionType, Colors, Interaction, Client, ChannelType, ButtonStyle } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {Interaction} interaction 
     * @param {Client} client
     * @returns 
     */
    async execute(interaction, client) {

        if (interaction.type === InteractionType.ApplicationCommand) {

            if (interaction.channel.type === ChannelType.DM || interaction.channel.type === ChannelType.GroupDM) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Hello lost traveler!")
                            .setColor(Colors.Blue)
                            .setDescription("We don't support DM commands at this time. [Invite QuaBot](https://discord.com/oauth2/authorize?scope=bot%20applications.commands&client_id=995243562134409296) to a server to try it out!")
                    ], components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel("Invite QuaBot")
                                    .setStyle(ButtonStyle.Link)
                                    .setURL('https://discord.com/oauth2/authorize?scope=bot%20applications.commands&client_id=995243562134409296')
                            )
                    ]
                }).catch((err => { }));
            

            const command = client.commands.get(interaction.commandName);

            if (!command) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setTitle("⛔ An error occured while trying to run this command!")
                ]
            }).catch((err => { })) && client.commands.delete(interaction.commandName);

            if (command.permission) {
                if (!interaction.member.permissions.has(command.permission)) {
                    return interaction.reply({ content: `You do not have the required permissions for this command: \`${interaction.commandName}\`.\nYou need the permission: \`${command.permission}\` to do that`, ephemeral: true }).catch((err => { }));
                }
            }


            // * Checks the bot's permissions.
            if (command.permissions) {
                let error = false;
                command.permissions.forEach(permission => {
                    if (!interaction.guild.members.me.permissions.has(permission)) error = true;
                    if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(permission)) error = true;
                });

                if (error) {
                    interaction.reply({
                        content:
                            `I need the permission(s): \`${command.permissions.map(i => i)}\` to execute that command. Double check my permissions for the server and/or this channel.`
                        , ephemeral: true
                    }).catch((err => { }));
                    return;
                }

            }

            const Customization = require('../../structures/schemas/CustomizationSchema');
            const CustomizationDatabase = await Customization.findOne({
                guildId: interaction.guild.id,
            }, (err, customization) => {
                if (err) console.log(err);
                if (!customization) {
                    const newCustomization = new Customization({
                        guildId: interaction.guild.id,
                        color: "#3a5a74"
                    });
                    newCustomization.save();
                }
            }).clone().catch((err => { }));

            if (!CustomizationDatabase) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("RED")
                        .setDescription("Unable to get this server's customization settings. Please try again.")
                ], ephemeral: true
            }).catch((err => { }));

            command.execute(client, interaction, CustomizationDatabase.color) // catch errors
            if (!command.name) return;

            // log commands being used

        }
    }
}

const { EmbedBuilder, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "purge",
    permission: PermissionFlagsBits.ManageMessages,
    permissions: [PermissionFlagsBits.ManageChannels],
    description: "Purge/clear/bulk delete some messages.",
    options: [
        {
            name: "amount",
            description: "How many messages should QuaBot purge?",
            required: true,
            type: ApplicationCommandOptionType.Integer
        },
        {
            name: "private",
            description: "Should QuaBot hide this command being performed?",
            required: false,
            type: ApplicationCommandOptionType.Boolean
        }
    ],
    async execute(client, interaction, color) {

        let amount = interaction.options.getInteger('amount');
        let public = !interaction.options.getBoolean('private');


        if (interaction.channel.type === ChannelType.GuildCategory) return;
        if (interaction.channel.type === ChannelType.GuildDirectory) return;
        if (interaction.channel.type === ChannelType.GuildForum) return;
        if (interaction.channel.type === ChannelType.GuildVoice) return;
        if (interaction.channel.type === ChannelType.GuildStageVoice) return;

        if (amount > 0) {
            if (amount > 100) return interaction.reply({ content: `You can't delete more than 100 messages.`, ephemeral: true });
            const size = await interaction.channel.bulkDelete(amount, true).catch(err => {
                if (err.code === 50013) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Lack of permissions!')
                                .setDescription(`I need some more permissions to perform that command. I need the \`MANAGE MESSAGES\` or \`ADMINISTRATOR\` permissions for that.`)
                                .setColor(color)
                        ]
                    }).catch((err => { }));
                }
            })
            if (public) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Messages purged')
                            .setDescription(`${amount} message(s) were purged from this channel by ${interaction.user}`)
                            .setColor(color)
                    ]
                }).catch((err => { }));
            } else {
                return interaction.reply({ content: `Deleted ${amount} messages.`, ephemeral: true }).catch((err => { }));
            }
        } else {
            return interaction.reply({ content: `You can't delete less than 1 message.`, ephemeral: true }).catch((err => { }));
        }

    }
}

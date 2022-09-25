const { Interaction, PermissionFlagsBits, EmbedBuilder, ChannelType, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages in a channel.')
        .setDMPermission(false)
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Messages to clear.')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('private')
                .setDescription('Should this purge be sent as a message?')
                .setRequired(false)),
    /**
     * @param {Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    permissions: [PermissionFlagsBits.ManageMessages],
    async execute(client, interaction, color) {

        let amount = interaction.options.getInteger('amount');
        let public = interaction.options.getBoolean('private') ? true : false;

        const logBlacklist = [
            ChannelType.DM,
            ChannelType.GroupDM,
            ChannelType.GuildCategory,
            ChannelType.GuildDirectory,
            ChannelType.GuildForum,
            ChannelType.GuildStageVoice,
            ChannelType.GuildVoice,
        ]

        if (logBlacklist.includes(interaction.channel.type)) return;

        if (amount > 0) {
            if (amount > 100) return interaction.reply({ content: `You can't delete more than 100 messages.`, ephemeral: true }).catch((e => { }));
            const size = await interaction.channel.bulkDelete(amount, true).catch(e => {
                if (e.code === 50013) {
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Lack of permissions!')
                                .setDescription(`I need some more permissions to perform that command. I need the \`MANAGE MESSAGES\` or \`ADMINISTRATOR\` permissions for that.`)
                                .setColor(color)
                        ]
                    }).catch((e => { }));
                }
            });

            if (public === false) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Messages purged')
                            .setDescription(`${amount} message(s) were purged from this channel by ${interaction.user}`)
                            .setColor(color)
                    ]
                }).catch((e => { }));
            } else {
                return interaction.reply({ content: `Deleted ${amount} messages.`, ephemeral: true }).catch((e => { }));
            }
        } else {
            return interaction.reply({ content: `You can't delete less than 1 message.`, ephemeral: true }).catch((e => { }));
        }

    }
}
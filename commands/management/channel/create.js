const { EmbedBuilder, Channel, Interaction, PermissionFlagsBits, ChannelType } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "create",
    command: "channel",
    permission: PermissionFlagsBits.Administrator,
    permissions: [PermissionFlagsBits.ManageChannels],
    /**
     * @param {Interaction} interaction
     * @param {Channel} channel
     */
    async execute(client, interaction, color) {

        const channelName = interaction.options.getString("name");
        const channelDescription = interaction.options.getString("description");
        const channelSlowmode = interaction.options.getString("slowmode") ? interaction.options.getString("slowmode") : "0s";
        const channelNsfw = interaction.options.getBoolean("nsfw") ? interaction.options.getBoolean("nsfw") : false;
        const channelCategory = interaction.options.getChannel("category");

        let category = channelCategory;
        if (category && category.type !== ChannelType.GuildCategory) category = null;

        let time = ms(channelSlowmode);
        if (!time) time = 0;
        if (time > 21600) time = 21600;

        const channel = await interaction.guild.channels.create({
            name: channelName,
            topic: channelDescription,
            rateLimitPerUser: time,
            nsfw: channelNsfw,
            parent: category
        }).catch((err => { }));

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription(`Succesfully created a channel: ${channel}.`)
                    .setTimestamp()
            ]
        }).catch((err => { }));


    }
}
const { EmbedBuilder, GuildChannel, Interaction, PermissionFlagsBits, ChannelType } = require('discord.js');
const ms = require('ms');
const { channelBlackList, logChannelBlackList } = require('../../../structures/files/contants');

module.exports = {
    name: "edit",
    command: "channel",
    permission: PermissionFlagsBits.Administrator,
    permissions: [PermissionFlagsBits.ManageChannels],
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {

        const channel = interaction.options.getChannel("channel");
        if (channelBlackList.includes(channel.type)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("That is not a valid channel.")
                    .setTimestamp()
            ]
        }).catch((err => { }));

        let channelName = interaction.options.getString("name") ? interaction.options.getString("name") : channel.name;
        const channelDescription = interaction.options.getString("description") ? interaction.options.getString("description") : channel.topic;
        const channelSlowmode = interaction.options.getString("slowmode") ? interaction.options.getString("slowmode") : (channel.rateLimitPerUser ? channel.rateLimitPerUser : "0s");

        let time = ms(channelSlowmode);
        if (!time) time = 0;
        if (time > 21600) time = 21600;

        if (logChannelBlackList.includes(channel.type)) {

            await channel.edit({
                name: channelName,
            }).catch((err => console.log(err)));

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setDescription(`Succesfully edit the channel: ${channel}.`)
                        .setTimestamp()
                ]
            }).catch((err => { }));

        } else {

            await channel.edit({
                name: channelName,
                rateLimitPerUser: time,
                topic: channelDescription
            }).catch((err => console.log(err)));

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setDescription(`Succesfully edit the channel: ${channel}.`)
                        .setTimestamp()
                ]
            }).catch((err => { }));

        }



    }
}
const { ApplicationCommandOptionType, Interaction, Client, EmbedBuilder, PermissionFlagsBits, MembershipScreeningFieldType } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');
const { getModerationConfig } = require('../../../structures/functions/config');

module.exports = {
    name: "unban",
    description: "Unban a user.",
    permission: PermissionFlagsBits.KickMembers,
    options: [
        {
            name: "userid",
            description: "Userid to unban",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "private",
            description: "Do you want this punishment to only be visible to you?",
            type: ApplicationCommandOptionType.Boolean,
            required: false
        }
    ],
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        const ephemeral = interaction.options.getBoolean("private") ? interaction.options.getBoolean("private") : false;

        await interaction.deferReply({ ephemeral }).catch(() => null);

        const userid = interaction.options.getString("userid");

        if (!userid) {
            return interaction.editReply({
                embeds: [await generateEmbed(color, "Please enter both a user and the reason for banning this user.")]
            }).catch(() => null);
        }

        const modConfig = await getModerationConfig(client, interaction.guild.id);
        if (!modConfig) {
            didBan = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "We just created a new config! Please run that command again.")]
            }).catch(() => null);
        }

        const channel = interaction.guild.channels.cache.get(modConfig.channelId);

        let member = await interaction.guild.bans.fetch(userid).catch(err => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`That user doesn't exist/isn't banned!`)
                        .setColor(color)
                ], ephemeral: true
            }).catch(() => null)
            return;
        });

        interaction.guild.members.unban(userid).catch(err => {
            if (err.code !== 50035) return;
        });

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`User Unbanned!`)
                    .setDescription(`**User:** <@${userid}>`)
                    .setColor(color)
            ], ephemeral
        }).catch(() => null);

        if (channel) channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`User Unbanned!`)
                    .setDescription(`**User:** <@${userid}>
                    **Unbanned By:** ${interaction.user}`)
                    .setColor(color)
                ]
        }).catch(() => null);
    }
}
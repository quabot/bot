const { ApplicationCommandOptionType, Interaction, Client, EmbedBuilder, PermissionFlagsBits, MembershipScreeningFieldType } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');
const { getModerationConfig } = require('../../../structures/functions/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.BanMembers)
        .setDescription('Unban a user.')
        .addStringOption(option => option.setName("userid").setDescription("Userid to unban.").setRequired(true))
        .addBooleanOption(option => option.setName("private").setDescription("Do you want the unban to be only visible to you?.").setRequired(false))
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        const ephemeral = interaction.options.getBoolean("private") ? interaction.options.getBoolean("private") : false;

        await interaction.deferReply({ ephemeral }).catch((e => { }));

        const userid = interaction.options.getString("userid");

        if (!userid) {
            return interaction.editReply({
                embeds: [await generateEmbed(color, "Please enter both a user and the reason for banning this user.")]
            }).catch((e => { }));
        }

        const modConfig = await getModerationConfig(client, interaction.guild.id);
        if (!modConfig) {
            didBan = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "We just created a new config! Please run that command again.")]
            }).catch((e => { }));
        }

        const channel = interaction.guild.channels.cache.get(modConfig.channelId);

        let member = await interaction.guild.bans.fetch(userid).catch(err => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`That user doesn't exist/isn't banned!`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((e => { }))
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
        }).catch((e => { }));

        if (channel) channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`User Unbanned!`)
                    .setDescription(`**User:** <@${userid}>
                    **Unbanned By:** ${interaction.user}`)
                    .setColor(color)
                ]
        }).catch((e => { }));
    }
}
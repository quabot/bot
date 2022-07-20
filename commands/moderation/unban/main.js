const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "unban",
    description: "Unban a user.",
    options: [
        {
            name: "user-id",
            description: "The ID of the user to unban.",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    permission: PermissionFlagsBits.BanMembers,
    async execute(client, interaction, color) {

        const userid = interaction.options.getString("user-id");

        let member = await interaction.guild.bans.fetch(userid).catch(err => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`That user doesn't exist/isn't banned!`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }))
            return;
        });

        interaction.guild.members.unban(userid).catch(err => {
            if (err.code !== 50035) return;
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`User Unbanned!`)
                    .setDescription(`**User:** <@${userid}>`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));
    }
}

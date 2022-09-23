const { Interaction, SlashCommandBuilder } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Add QuaBot to your own servers.')
        .setDMPermission(false),
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch((e => { }));

        interaction.editReply({
            embeds: [await generateEmbed(color, "Invite QuaBot **[here](https://discord.com/oauth2/authorize?client_id=995243562134409296&permissions=274878426206&redirect_uri=https%3A%2F%2Fapi.quabot.net%2Fauth&response_type=code&scope=bot%20applications.commands%20guilds%20identify)**.")]
        }).catch((e => { }));
    }
}
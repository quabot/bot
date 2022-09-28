const { Interaction, SlashCommandBuilder } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Vote for QuaBot.')
        .setDMPermission(false),
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch((e => { }));

        interaction.editReply({
            embeds: [await generateEmbed(color, "By voting for QuaBot, you can help us grow for free! It only takes a few seconds, and it gives you some perks! Vote **[here](https://top.gg/bot/995243562134409296)**.")]
        }).catch((e => { }));
    }
}
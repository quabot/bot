const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "emotes",
    description: "List all the server emojis.",
    /**
     * @param {import('discord.js').Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();

        const emoteList = interaction.guild.emojis.cache.map(e => ` ${e}`);

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription(`${emoteList}`)
            ]
        }).catch((e => { }));
    }
}
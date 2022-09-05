const { Interaction,  ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');
const { generateEmbed } = require('../../../structures/functions/embed');
const { convertHMS } = require('../../../structures/functions/time');

module.exports = {
    name: "slowmode",
    description: "Set a channel slowmode.",
    options: [
        {
            name: "channel",
            description: "Channel to change the slowmode of.",
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: "slowmode",
            description: "Slowmode to set it to (format: 20min, 2h, 600min)",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    /**
     * @param {Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    permissions: [PermissionFlagsBits.ManageChannels],
    async execute(client, interaction, color) { 

        await interaction.deferReply().catch((e => { }));

        const channel = interaction.options.getChannel("channel");
        let slowmode = Math.round(ms(interaction.options.getString("slowmode")) / 1000);

        if (!slowmode) return interaction.editReply({
            embeds: [await generateEmbed(color, "No slowmode given! Format: 1h, 6h, 20min.")]
        }).catch((e => { }));

        if (slowmode > 21600) slowmode = 21600;
        if (slowmode < 0) slowmode = 0;

        channel.setRateLimitPerUser(slowmode).catch((e => { }))

        interaction.editReply({
            embeds: [await generateEmbed(color, `Slowmode set to: **${await convertHMS(slowmode)}**`)]
        }).catch((e => { }));
    }
}
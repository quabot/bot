const { Interaction, EmbedBuilder, Client } = require('discord.js');
const types = [
    'Text',
    'DM',
    'Voice',
    'DM',
    'Category',
    'News',
    'News Thread',
    'Thread',
    'Private Thread',
    'Stage',
    'Directory',
    'Forum',
];

module.exports = {
    name: 'channel',
    command: 'info',
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply().catch(e => {});

        const ch = interaction.options.getChannel('channel');

        interaction
            .editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setTitle(`Channel Info`)
                        .addFields(
                            {
                                name: '**General:**',
                                value: `
                        **• Name:** ${ch.name}
                        **• Channel:** ${ch}
                        **• ID:** ${ch.id}
                        **• Type:** ${types[ch.type]}
                        **• NSFW:** ${ch.nsfw ? 'Enabled' : 'Disabled'}
                        **• Ratelimit:** ${ch.nsfw ? 'Enabled' : 'Disabled'}
                        **• Parent:** ${ch.parentId ? '<#' + ch.parentId + '>' : 'No parent category.'}
                        `,
                                inline: false,
                            },
                            { name: '**Description:**', value: `${ch.topic || 'Not set'}`, inline: false }
                        )
                        .setFooter({ text: 'quabot.net', iconURL: 'https://images-ext-1.discordapp.net/external/Eb7UTgAZjRli_Q-Wi3T0ttLuzyuDP-2Hi78-rNcW2f8/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/995243562134409296/b490d5cd8983d4f22f265c6548e53507.webp?width=663&height=663' })
                        .setTimestamp(),
                ],
            })
            .catch(e => {});
    },
};

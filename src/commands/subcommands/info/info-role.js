const { Interaction, EmbedBuilder, Client } = require('discord.js');

module.exports = {
    name: 'role',
    command: 'info',
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply().catch(e => {});

        const role = interaction.options.getRole('role');

        interaction
            .editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setTitle(`Role Info`)
                        .addFields({
                            name: '**General:**',
                            value: `
                        **• Name:** ${role.name}
                        **• Role:** ${role}
                        **• ID:** ${role.id}
                        **• Color:** ${role.color}
                        **• Mentionable:** ${role.mentionable ? 'Yes' : 'No'}
                        **• Seperated:** ${role.hoist ? 'Yes' : 'No'}
                        `,
                            inline: false,
                        })
                        .setFooter({ text: 'quabot.net', iconURL: 'https://images-ext-1.discordapp.net/external/Eb7UTgAZjRli_Q-Wi3T0ttLuzyuDP-2Hi78-rNcW2f8/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/995243562134409296/b490d5cd8983d4f22f265c6548e53507.webp?width=663&height=663' })
                        .setTimestamp(),
                ],
            })
            .catch(e => {});
    },
};

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
                        .setTimestamp(),
                ],
            })
            .catch(e => {});
    },
};

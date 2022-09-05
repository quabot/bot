const { Interaction, Client, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder, Colors } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');
const Application = require('../../../structures/schemas/ApplicationSchema');

module.exports = {
    name: "list",
    command: "applications",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {
        
        await interaction.deferReply({ ephemeral: true }).catch((e => { }));

        const applications = await Application.find({
            guildId: interaction.guildId
        });

        if (!applications) return interaction.editReply({
            embeds: [await generateEmbed(color, "Couldn't find any configured applications in this server! Add one on [my dashboard](https://dashboard.quabot.net).")]
        }).catch((e => { }));

        const backId = 'back-list'
        const forwardId = 'forward-list'
        const backButton = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: 'Back',
            emoji: '⬅️',
            customId: backId
        });
        const forwardButton = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: 'Forward',
            emoji: '➡️',
            customId: forwardId
        });

        const makeEmbed = async start => {
            const current = applications.slice(start, start + 5);

            return new EmbedBuilder({
                color: Colors.Green,
                timestamp: Date.now(),
                title: `Applications ${start + 1}-${start + 5}/${applications.length}`,
                fields: await Promise.all(
                    current.map(async (application) => {
                        return ({
                            name: `${application.applicationName} - \`${application.applicationId}\``,
                            value: `${application.applicationDescription}`,
                            inline: true
                        });
                    })
                )
            });
        }

        let currentIndex = 0;

        const canFit = applications.length <= 5;
        const msg = await interaction.editReply({
            embeds: [await makeEmbed(0)],
            ephemeral: true,
            components: canFit
                ? []
                : [new ActionRowBuilder({ components: [forwardButton] })]
        })
        if (canFit) return;

        const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

        collector.on('collect', async interaction => {

            interaction.customId === backId ? (currentIndex -= 5) : (currentIndex += 5)
            await interaction.update({
                embeds: [await makeEmbed(currentIndex)],
                components: [
                    new ActionRowBuilder({
                        components: [
                            ...(currentIndex ? [backButton] : []),
                            ...(currentIndex + 5 < applications.length ? [forwardButton] : []),
                        ]
                    })
                ]
            });
        });
    }
}
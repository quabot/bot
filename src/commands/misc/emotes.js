const {
    EmbedBuilder,
    ButtonStyle,
    ButtonBuilder,
    ActionRowBuilder,
    Colors,
    SlashCommandBuilder,
} = require('discord.js');

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('emotes')
        .setDescription('List all the server emojis.')
        .setDMPermission(false),
    /**
     * @param {import('discord.js').Interaction} interaction
     */
    async execute(client, interaction, color) {
        //* Defer the reply to give the user an instant response.
        await interaction.deferReply();

        //* Create an array of all the emojis in the guild.
        const emoteList = [];
        interaction.guild.emojis.cache.forEach(e => {
            emoteList.push(e);
        });

        
        //* Create the multi-page system.
        //? don't touch it lol
        const backId = 'backMusic';
        const forwardId = 'forwardMusic';
        const backButton = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: 'Back',
            emoji: '⬅️',
            customId: backId,
        });
        const forwardButton = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: 'Forward',
            emoji: '➡️',
            customId: forwardId,
        });

        const makeEmbed = async start => {
            const current = emoteList.slice(start, start + 10);

            return new EmbedBuilder({
                color: Colors.Green,
                timestamp: Date.now(),
                title: `Emotes ${start + 1}-${start + 10}/${emoteList.length}`,
                fields: await Promise.all(
                    current.map(async emote => {
                        return {
                            name: `${emote.name}`,
                            value: `${emote}`,
                            inline: true,
                        };
                    })
                ),
            });
        };

        let currentIndex = 0;

        const canFit = emoteList.length <= 10;
        const msg = await interaction.editReply({
            embeds: [await makeEmbed(0)],
            ephemeral: true,
            components: canFit ? [] : [new ActionRowBuilder({ components: [forwardButton] })],
        });
        if (canFit) return;

        const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

        collector.on('collect', async interaction => {
            interaction.customId === backId ? (currentIndex -= 10) : (currentIndex += 10);
            await interaction.update({
                embeds: [await makeEmbed(currentIndex)],
                components: [
                    new ActionRowBuilder({
                        components: [
                            ...(currentIndex ? [backButton] : []),
                            ...(currentIndex + 10 < emoteList.length ? [forwardButton] : []),
                        ],
                    }),
                ],
            });
        });
    },
};

const { ApplicationCommandType, EmbedBuilder, ContextMenuCommandBuilder } = require('discord.js');
const houses = [
    { name: 'HypeSquadOnlineHouse1', emoji: 'Bravery' },
    { name: 'HypeSquadOnlineHouse2', emoji: 'Brilliance' },
    { name: 'HypeSquadOnlineHouse3', emoji: 'Balance' },
];

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Userinfo')
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").Interaction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply().catch(e => {});

        const user = interaction.targetMember;
        const userObject = interaction.targetUser;
        async function getHexColor(user) {
            if (user.displayHexColor !== '#000000') {
                return user.displayHexColor;
            } else return color;
        }

        let badges = [];
        houses.forEach(e => {
            if (userObject.flags.toArray().includes(e.name)) badges.push(e.emoji);
        });

        interaction
            .editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(await getHexColor(user))
                        .setThumbnail(`${user.user.displayAvatarURL({ dynamic: true, size: 1024 })}`)
                        .setTitle('User Info')
                        .addFields({
                            name: `**General:**`,
                            value: `
                        **• Name**: ${user.user}
                        **• ID**: ${user.user.id}
                        **• Roles**: ${
                            user.roles.cache
                                .map(r => r)
                                .join(' ')
                                .replace('@everyone', ' ') || 'None'
                        }
                        **• Joined Server**: <t:${parseInt(user.joinedTimestamp / 1000)}:R>
                        **• Joined Discord**: <t:${parseInt(user.user.createdTimestamp / 1000)}:R>
                        **• House**: ${badges.join(' ')}
                    `,
                            inline: false,
                        }),
                ],
            })
            .catch(e => {});
    },
};

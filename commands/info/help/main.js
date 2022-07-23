const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

module.exports = {
    name: "help",
    description: "List all of QuaBot's commands.",
    async execute(client, interaction, color) {

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`QuaBot Commands`)
                    .setDescription(`Select an item from the dropdown below this message to view the commands in that category.`)
                    .addFields({ name: "Quick Links", value: "[Invite](https://invite.quabot.net) - [Discord](https://discord.quabot.net) - [Website](https://quabot.net)" })
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .setColor(color)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId('select')
                            .setPlaceholder('Select a category')
                            .addOptions([
                                {
                                    label: '😂 Fun Commands',
                                    description: 'Play a game, get a meme or ask a question, these are the fun commands.',
                                    value: 'fun_commands',
                                },
                                {
                                    label: '📄 Info Commands',
                                    description: 'Bot status, ping, info about a user, these are the info commands.',
                                    value: 'info_commands',
                                },
                                {
                                    label: '🔨 Moderation Commands',
                                    description: 'Ban users, warn them and so much more, these are the moderation commands.',
                                    value: 'moderation_commands',
                                },
                                {
                                    label: '👨‍💼 Mangement Commands',
                                    description: 'Make reaction roles, purge a channel, these are the management commands.',
                                    value: 'management_commands',
                                },
                                {
                                    label: '⚙️ System Commands',
                                    description: 'View your XP, leave suggestions, create a ticket and so much more, these are the other commands.',
                                    value: 'system_commands',
                                },
                            ]),
                    )
            ]
        }).catch((err => { }));

    }
}
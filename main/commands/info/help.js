const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: "help",
    description: "Bot commands.",
    async execute(client, interaction, color) {
        try {

            // Sends the help message with the correct menus.
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`QuaBot Commands`)
                        .setDescription(`Select an item from the dropdown below this message to view the commands in that category.`)
                        .addField("Quick Links", "[Invite](https://discord.com/oauth2/authorize?client_id=845603702210953246&permissions=275384757342&scope=bot%20applications.commands) - [Discord](https://discord.gg/9kPCU8GHSK) - [Website](https://quabot.net)")
                        .setThumbnail(client.user.avatarURL({ dynamic: true }))
                        .setColor(color)
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
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
                                        label: '👍 Misc Commands',
                                        description: 'See the servericon or avatar, these are the misc commands.',
                                        value: 'misc_commands',
                                    },
                                    {
                                        label: '🔨 Moderation Commands',
                                        description: 'Ban users, warn them and so much more, these are the moderation commands.',
                                        value: 'moderation_commands',
                                    },
                                    {
                                        label: '👨‍💼 Mangement Commands',
                                        description: 'Configure QuaBot, lock a server down, these are the management commands.',
                                        value: 'management_commands',
                                    },
                                    {
                                        label: '⚙️ Other Commands',
                                        description: 'View your XP, leave suggestions, listen to music and so much more, these are the other commands.',
                                        value: 'system_commands',
                                    },
                                ]),
                        )
                ]
            }).catch(( err => { } ))

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
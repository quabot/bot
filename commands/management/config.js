const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: "config",
    description: 'Configure QuaBot.',
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "general",
            description: "General configuration of channels & features.",
            type: "SUB_COMMAND",
        },
        {
            name: "welcome",
            description: "Configure the welcome module.",
            type: "SUB_COMMAND",
        },
        {
            name: "logging",
            description: "Configure logging channels, what events to log and more.",
            type: "SUB_COMMAND",
        },
    ],
    async execute(client, interaction, color) {
        try {
            const subCmd = interaction.options.getSubcommand();
            switch (subCmd) {
                case 'general':
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setTitle(`${client.user.username} General Configuration`)
                                .addField("Quick Links", "[Invite](https://discord.com/oauth2/authorize?client_id=845603702210953246&permissions=275384757342&scope=bot%20applications.commands) - [Discord](https://discord.gg/9kPCU8GHSK) - [Website](https://quabot.net)")
                                .setThumbnail(client.user.avatarURL({ dynamic: true }))
                                .setDescription("Use the selector below this message to select a category.")
                        ], components: [
                            new MessageActionRow()
                                .addComponents(
                                    new MessageSelectMenu()
                                        .setCustomId('general')
                                        .setPlaceholder('Select a category')
                                        .addOptions([
                                            {
                                                label: '💡 Suggestions',
                                                description: 'Configure the suggestions module.',
                                                value: 'general_suggestions',
                                            },
                                            {
                                                label: '📊 Polls',
                                                description: 'Configure the polls module.',
                                                value: 'general_polls',
                                            },
                                        ]),
                                )
                        ]
                    }).catch((err => { }));
                    break;

                case 'welcome':
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setTitle(`${client.user.username} Welcome Configuration`)
                                .addField("Quick Links", "[Invite](https://discord.com/oauth2/authorize?client_id=845603702210953246&permissions=275384757342&scope=bot%20applications.commands) - [Discord](https://discord.gg/9kPCU8GHSK) - [Website](https://quabot.net)")
                                .setThumbnail(client.user.avatarURL({ dynamic: true }))
                                .setDescription("Use the selector below this message to select a category.")
                        ], components: [
                            new MessageActionRow()
                                .addComponents(
                                    new MessageSelectMenu()
                                        .setCustomId('welcome')
                                        .setPlaceholder('Select a category')
                                        .addOptions([
                                            {
                                                label: '✅ Toggles',
                                                description: 'Toggle join and leave messages.',
                                                value: 'welcome_toggles',
                                            },
                                            {
                                                label: '💬 Messages',
                                                description: 'Configure join and leave messages.',
                                                value: 'welcome_messages',
                                            },
                                            {
                                                label: '📄 Roles',
                                                description: 'Configure and toggle join roles.',
                                                value: 'welcome_roles',
                                            },
                                        ]),
                                )
                        ]
                    }).catch((err => { }));
                    break;

                case 'logging':
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setTitle(`${client.user.username} Welcome Configuration`)
                                .addField("Quick Links", "[Invite](https://discord.com/oauth2/authorize?client_id=845603702210953246&permissions=275384757342&scope=bot%20applications.commands) - [Discord](https://discord.gg/9kPCU8GHSK) - [Website](https://quabot.net)")
                                .setThumbnail(client.user.avatarURL({ dynamic: true }))
                                .setDescription("Use the selector below this message to select a category.")
                        ], components: [
                            new MessageActionRow()
                                .addComponents(
                                    new MessageSelectMenu()
                                        .setCustomId('logging')
                                        .setPlaceholder('Select a category')
                                        .addOptions([
                                            {
                                                label: '📄 Channels',
                                                description: 'Change the logging channels.',
                                                value: 'logging_channels',
                                            },
                                            {
                                                label: '✅ Toggles',
                                                description: 'Toggle certain logging features.',
                                                value: 'logging_toggles',
                                            },
                                            {
                                                label: '💬 Toggle Events',
                                                description: 'Toggle logging for certain events.',
                                                value: 'logging_events',
                                            },
                                        ]),
                                )
                        ]
                    }).catch((err => { }));
                    break;
            }
        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}

// Kijk, ik zie het een beetje zo: er zijn 2 soort groepen en een groot deel van de mensen in deze app komt nooit, en dus krijg je dan soort 2 groepen en ook als je ergens bent is het verdeeld, ik vind zelf sommige dingen
const { MessageEmbed } = require('discord.js');
const RewardSchema = require('../../structures/schemas/RewardSchema');

module.exports = {
    name: "config-level",
    description: 'Configure the levels module.',
    permission: "ADMINISTRATOR",
    options: [
        {
            name: 'rank-card',
            description: 'Toggle a rank card.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'enabled',
                    description: 'Toggle a rank card.',
                    type: 'BOOLEAN',
                    required: true,
                },
            ],
        },
        {
            name: 'enabled',
            description: 'Toggle the levels system.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'enabled',
                    description: 'Toggle the levels system.',
                    type: 'BOOLEAN',
                    required: true,
                },
            ],
        },
        {
            name: 'add-reward',
            description: 'Add a levelling reward',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'level',
                    description: 'The level required to get this role',
                    type: 'NUMBER',
                    required: true,
                },
                {
                    name: 'role',
                    description: 'The role reward for reaching this level',
                    type: 'ROLE',
                    required: true,
                },
            ]
        },
        {
            name: 'remove-reward',
            description: 'Remove a leveling reward',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'role',
                    description: 'The role to remove',
                    type: 'ROLE',
                    required: true,
                },
            ],
        },
    ],
    async execute(client, interaction, color) {
        try {

            const Guild = require('../../structures/schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        logChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        punishmentChannelID: "none",
                        pollID: 0,
                        logEnabled: true,
                        levelEnabled: false,
                        welcomeEmbed: true,
                        pollEnabled: true,
                        suggestEnabled: true,
                        welcomeEnabled: true,
                        leaveEnabled: true,
                        roleEnabled: false,
                        mainRole: "none",
                        joinMessage: "Welcome {user} to **{guild}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            message.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(err => console.log(err));
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(color)
                        .setDescription(`Added this server to the database, please run that command again.`)
                ]
            }).catch((err => { }));

            const subCmd = interaction.options.getSubcommand();
            switch (subCmd) {
                case 'rank-card':
                    const newOption = interaction.options.getBoolean('enabled');
                    await guildDatabase.updateOne({
                        levelCard: newOption
                    });

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`Rank card enabled is now set to **${newOption}**`)
                        ], ephemeral: true
                    }).catch((err => { }));

                    break;

                case 'enabled':
                    const newEnabled = interaction.options.getBoolean('enabled');
                    await guildDatabase.updateOne({
                        levelEnabled: `${newEnabled}`
                    });

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`Level system enabled is now set to **${newEnabled}**`)
                        ], ephemeral: true
                    }).catch((err => { }));

                    break;

                case 'add-reward':
                    const level = interaction.options.getNumber('level');
                    const role = interaction.options.getRole('role');

                    RewardSchema.create({
                        guildId: interaction.guild.id,
                        level: level,
                        role: role
                    });

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`Level **${level}** will now reward users with role **${role}**!`)
                        ], ephemeral: true
                    }).catch((err => { }));

                    break;

                case 'remove-reward':
                    const remRole = interaction.options.getRole('role');

                    const result = await RewardSchema.findOne({ guildId: interaction.guild.id, role: remRole })

                    if (!result) return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`No role reward with that role.`)
                        ], ephemeral: true
                    }).catch((err => { }));

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`Removed.`)
                        ], ephemeral: true
                    }).catch((err => { }));

                    break;

            }
        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
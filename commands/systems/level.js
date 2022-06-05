const { MessageEmbed, MessageAttachment } = require('discord.js');
const Level = require('../../structures/schemas/levelSchema');
const canvacord = require('canvacord');

module.exports = {
    name: "level",
    description: "Level system.",
    options: [
        {
            name: 'view',
            description: 'View the level of you or someone else',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The user to view',
                    type: 'USER',
                    required: false,
                },
            ],
        },
        {
            name: 'leaderboard',
            description: 'Get the top 15 users',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'type',
                    description: 'Choose how to rank the leaderboard',
                    type: 'STRING',
                    required: true,
                    choices: [
                        {
                            name: 'xp',
                            value: 'xp',
                        },
                        {
                            name: 'level',
                            value: 'level',
                        },
                    ],
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
                        logSuggestChannelID: "none",
                        logPollChannelID: "none",
                        afkEnabled: true,
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        punishmentChannelID: "none",
                        pollID: 0,
                        logEnabled: true,
                        modEnabled: true,
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
                            message.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(( err => { } ))
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

            if (guildDatabase.levelEnabled === "false") return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(color)
                        .setDescription(`Levels are disabled in this server. Ask an admin to enable them with\`/config-level\`!`)
                ]
            }).catch((err => { }));

            const sub = interaction.options.getSubcommand();
            switch (sub) {
                case 'view':
                    let user = interaction.options.getUser('user');
                    if (!user) user = interaction.user;

                    const levelDatabase = await Level.findOne({
                        userId: user.id,
                        guildId: interaction.guild.id,
                    }, (err, level) => {
                        if (err) console.error(err);
                        if (!level) {
                            const newLevel = new Level({
                                userId: `${user.id}`,
                                guildId: `${interaction.guild.id}`,
                                xp: 0,
                                level: 0,
                                role: "0",
                            });
                            newLevel.save()
                                .catch(err => {
                                    console.log(err);
                                    message.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(( err => { } ))
                                });
                        }
                    }).clone().catch(function (err) { console.log(err) });

                    if (!levelDatabase) return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(color)
                                .setDescription(`${user.tag} doesn't have a rank! Send messages to get one.`)
                        ]
                    }).catch((err => { }));

                    if (guildDatabase.levelCard === true) {
                        const rankCard = new canvacord.Rank()
                            .setAvatar(user.displayAvatarURL({ dynamic: false, format: 'png' }))
                            .setCurrentXP(levelDatabase.xp)
                            .setRequiredXP(levelDatabase.level * 300 + 100)
                            .setProgressBar(color, 'COLOR', true)
                            .setUsername(user.username)
                            .setLevel(levelDatabase.level)
                            .setDiscriminator(user.discriminator)
                            .setRank(1, 'none', false)
                        rankCard.build().then(data => {
                            const attactment = new MessageAttachment(data, 'level.png')
                            interaction.reply({ files: [attactment] }).catch((err => { }));
                        });
                    } else {
                        interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(color)
                                    .setTitle(`${user.username}'s level`)
                                    .setThumbnail(user.avatarURL())
                                    .setDescription(`**XP:** \`${levelDatabase.xp}/${levelDatabase.level * 300 + 100}\` (${Math.round(levelDatabase.xp / (levelDatabase.level * 300 + 100) * 100)}%)\n**Level:** \`${levelDatabase.level}\``)
                            ]
                        }).catch((err => { }));
                    }
                    break;

                case 'leaderboard':
                    if (interaction.options.getString('type') === 'xp') {
                        let text = ''
                        const results = await Level.find({
                            guildId: interaction.guild.id,
                        }).sort({ xp: -1 }).limit(15);

                        if (!results) return interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(color)
                                    .setDescription(`Could not find anyone with XP!`)
                            ]
                        }).catch((err => { }));

                        for (let counter = 0; counter < results.length; ++counter) {
                            const { userId, xp = 0 } = results[counter];
                            text += `**#${counter + 1}** <@${userId}> - \`${xp}\`\n`;
                        }

                        interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle(`${interaction.guild.name}'s XP Leaderboard`)
                                    .setColor(color)
                                    .setDescription(text)]
                        }).catch((err => { }));
                    } else {
                        let text = ''

                        const results = await Level.find({
                            guildId: interaction.guild.id,
                        }).sort({ level: -1 }).limit(15);

                        if (!results) return interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(color)
                                    .setDescription(`Could not find anyone with levels!`)
                            ]
                        }).catch((err => { }));

                        for (let counter = 0; counter < results.length; ++counter) {
                            const { userId, level = 0 } = results[counter];
                            text += `**#${counter + 1}** <@${userId}> - \`${level}\`\n`;
                        }

                        interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle(`${interaction.guild.name}'s Level Leaderboard`)
                                    .setColor(color)
                                    .setDescription(text)]
                        }).catch((err => { }));
                    }
                    break;
            }

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
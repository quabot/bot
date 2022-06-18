const { MessageEmbed, MessageButton, MessageActionRow, File } = require('discord.js');

module.exports = {
    name: "music",
    description: "Use the music system.",
    options: [
        {
            name: "play",
            description: "Play a song.",
            type: "SUB_COMMAND",
            options: [{ name: "search", description: "URL or song name.", type: "STRING", required: true }]
        },
        {
            name: "skip",
            description: "Skip a song.",
            type: "SUB_COMMAND",
        },
        {
            name: "options",
            description: "Other options.",
            type: "SUB_COMMAND",
            options: [{
                name: "option", description: "Pick an option.", type: "STRING", required: true,
                choices: [
                    { name: "queue", value: "queue" },
                    { name: "stop", value: "stop" },
                    { name: "repeat", value: "repeat" },
                    { name: "volume", value: "volume" },
                    { name: "pause", value: "pause" },
                    { name: "shuffle", value: "shuffle" },
                    { name: "resume", value: "resume" },
                    { name: "lyrics", value: "lyrics" },
                    { name: "nowplaying", value: "nowplaying" },
                ]
            }],
        }
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
                        ticketCategory: "none",
                        ticketClosedCategory: "none",
                        ticketEnabled: true,
                        ticketStaffPing: true,
                        ticketTopicButton: true,
                        ticketSupport: "none",
                        ticketId: 1,
                        ticketLogs: true,
                        ticketChannelID: "none",
                        afkStatusAllowed: "true",
                        musicEnabled: "true",
                        musicOneChannelEnabled: "false",
                        musicChannelID: "none",
                        suggestChannelID: "none",
                        logSuggestChannelID: "none",
                        logPollChannelID: "none",
                        afkEnabled: true,
                        welcomeChannelID: "none",
                        leaveChannelID: "none",
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
                        membersChannel: "none",
                        membersMessage: "Members: {count}",
                        memberEnabled: true
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            message.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch((err => { }))
                        });
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`We added this server to the database! Please run that command again.`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));


            if (guildDatabase.musicEnabled === "false") return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Music is disabled in this server.`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));

            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member.voice.channel) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Please join a voice channel to use the music commands.`)
                        .setColor(color)
                ]
            })
            if (member.voice.channelId !== interaction.guild.me.voice.channelId) {
                if (interaction.guild.me.voice.channelId) {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(`We're not in the same voice channel! Join <#${interaction.guild.me.voice.channelId}> to use that command.`)
                                .setColor(color)
                        ]
                    }).catch((err => { }))
                    return;
                }
            }

            if (guildDatabase.musicOneChannelEnabled === "true") {
                const channel = interaction.guild.channels.cache.get(guildDatabase.musicChannelID);
                if (!channel) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`One channel mode for music is enabled, but no channel was found! Please reconfigure this.`)
                            .setColor(color)
                    ]
                }).catch((err => { }));
                if (member.voice.channelId !== guildDatabase.musicChannelID) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`You can only use music in ${channel}!`)
                            .setColor(color)
                    ]
                }).catch((err => { }));
            }

            const subCmd = interaction.options.getSubcommand();

            switch (subCmd) {
                case 'play':
                    const search = interaction.options.getString("search");
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription("✅ Request recieved!")
                                .setColor(color)
                        ]
                    });

                    const voiceChannel = member.voice.channel;
                    client.distube.play(voiceChannel, `${search}`, {
                        textChannel: interaction.channel,
                    }).catch((err => { }))

                    break;

                case 'skip':
                    const queue = client.distube.getQueue(interaction);
                    if (!queue) return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription("🎵 There are no songs playing!")
                                .setColor(color)
                        ]
                    });

                    if (!queue.songs[1]) return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription("🎵 There is no next song!")
                                .setColor(color)
                        ]
                    });

                    client.distube.skip(queue);
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setDescription("⏭️ Skipped a song!")
                                .setColor(color)
                        ]
                    });
                    break;

                case 'options':
                    const option = interaction.options.getString("option");

                    switch (option) {

                        case 'lyrics':
                            const queueLyrics = client.distube.getQueue(interaction);
                            if (!queueLyrics) return interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("🎵 There are no songs playing!")
                                        .setColor(color)
                                ]
                            }).catch((err => { }))

                            let song2 = queueLyrics.songs[0];

                            const Genius = require("genius-lyrics");
                            const Lyrics = new Genius.Client();

                            const searches = await Lyrics.songs.search(song2.name).catch((err => {
                                interaction.reply({
                                    embeds: [
                                        new MessageEmbed()
                                            .setDescription("🎶 Couldn't find lyrics for that song!")
                                            .setColor(color)
                                    ]
                                }).catch((err => { }))
                            }));


                            const firstSong = searches[0];
                            const lyrics = await firstSong.lyrics();

                            interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(color)
                                        .setDescription("You can dismiss this message. If no lyrics show, they are too long.")
                                ], ephemeral: true
                            }).catch((err => { }));

                            interaction.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(color)
                                        .setTitle(`Lyrics for ${song2.name}`)
                                        .setDescription(`${lyrics}`)
                                ], ephemeral: true
                            }).catch((err => {
                                interaction.channel.send(`**Lyrics for ${song2.name}**\n\n${lyrics}`).catch((err => console.log(err)));
                            }));
                            break;


                        case 'stop':
                            const queueStop = client.distube.getQueue(interaction);

                            if (!queueStop) return interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("🎵 There are no songs playing!")
                                        .setColor(color)
                                ]
                            });

                            client.distube.stop(queueStop);
                            interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("⏹️ Stopped the stream and left the voice channel!")
                                        .setColor(color)
                                ]
                            });
                            break;

                        case 'queue':
                            const queue = client.distube.getQueue(interaction);

                            if (!queue) return interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("🎵 There are no songs playing!")
                                        .setColor(color)
                                ]
                            });

                            interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("🔃 Getting queue")
                                        .setColor(color)
                                ]
                            });

                            const backId = 'backMusic'
                            const forwardId = 'forwardMusic'
                            const backButton = new MessageButton({
                                style: 'SECONDARY',
                                label: 'Back',
                                emoji: '⬅️',
                                customId: backId
                            });
                            const forwardButton = new MessageButton({
                                style: 'SECONDARY',
                                label: 'Forward',
                                emoji: '➡️',
                                customId: forwardId
                            });

                            const { user, channel } = interaction;
                            const songs = [...client.distube.getQueue(interaction).songs];

                            const makeEmbed = async start => {
                                const current = songs.slice(start, start + 10);

                                return new MessageEmbed({
                                    title: `Showing songs ${start + 1}-${start + current.length} out of ${songs.length
                                        }`,
                                    color: color,
                                    fields: await Promise.all(
                                        current.map(async (song, id) => ({
                                            name: `${id + start + 1}. ${song.name}`,
                                            value: `\`${song.formattedDuration}\` - [Link](${song.url})`
                                        }))
                                    )
                                });
                            }

                            const canFit = songs.length <= 10
                            const msg = await channel.send({
                                embeds: [await makeEmbed(0)],
                                components: canFit
                                    ? []
                                    : [new MessageActionRow({ components: [forwardButton] })]
                            })
                            if (canFit) return;

                            const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

                            let currentIndex = 0
                            collector.on('collect', async interaction => {
                                interaction.customId === backId ? (currentIndex -= 10) : (currentIndex += 10)
                                await interaction.update({
                                    embeds: [await makeEmbed(currentIndex)],
                                    components: [
                                        new MessageActionRow({
                                            components: [
                                                ...(currentIndex ? [backButton] : []),
                                                ...(currentIndex + 10 < songs.length ? [forwardButton] : [])
                                            ]
                                        })
                                    ]
                                });
                            });

                            break;

                        case 'repeat':
                            const queueRepeat = client.distube.getQueue(interaction);
                            if (!queueRepeat) return interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("🎵 There are no songs playing!")
                                        .setColor(color)
                                ]
                            }).catch((err => { }))

                            const repeatOffId = 'repeatOff'
                            const repeatQueueId = 'repeatQueue'
                            const repeatOneId = 'repeatOne'
                            const repeatOff = new MessageButton({
                                style: 'SECONDARY',
                                label: 'Off',
                                emoji: '▶️',
                                customId: repeatOffId
                            });
                            const repeatQueue = new MessageButton({
                                style: 'SECONDARY',
                                label: 'Queue',
                                emoji: '🔁',
                                customId: repeatQueueId
                            });
                            const repeatOne = new MessageButton({
                                style: 'SECONDARY',
                                label: 'Song',
                                emoji: '🔂',
                                customId: repeatOneId
                            });

                            const repeatMessage = await interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("Select a repeat mode with the buttons below this message!")
                                        .setColor(color)
                                ], fetchReply: true,
                                components: [new MessageActionRow({ components: [repeatOff, repeatQueue, repeatOne] })]
                            }).catch((err => { }))

                            const collectorRepeat = repeatMessage.createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id });

                            collectorRepeat.on('collect', async interaction => {
                                if (interaction.customId === repeatOffId) {
                                    client.distube.setRepeatMode(interaction, 0)
                                    await interaction.update({
                                        embeds: [
                                            new MessageEmbed()
                                                .setDescription("▶️ Turned repeat off!")
                                                .setColor(color)
                                        ], components: []
                                    }).catch((err => { }))
                                } else if (interaction.customId === repeatOneId) {
                                    client.distube.setRepeatMode(interaction, 1)
                                    await interaction.update({
                                        embeds: [
                                            new MessageEmbed()
                                                .setDescription("🔂 Repeating song!")
                                                .setColor(color)
                                        ], components: []
                                    }).catch((err => { }))
                                } else if (interaction.customId === repeatQueueId) {
                                    client.distube.setRepeatMode(interaction, 2)
                                    await interaction.update({
                                        embeds: [
                                            new MessageEmbed()
                                                .setDescription("🔁 Repeating queue!")
                                                .setColor(color)
                                        ], components: []
                                    }).catch((err => { }))
                                }
                            });

                        case 'volume':
                            const queueVolume = client.distube.getQueue(interaction);
                            if (!queueVolume) return interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("🎵 There are no songs playing!")
                                        .setColor(color)
                                ]
                            }).catch((err => { }))

                            const volumePlus = 'volumeAdd'
                            const volumeBasic = 'volumeReset'
                            const volumeDown = 'volumeRemove'
                            const volumeMinBtn = new MessageButton({
                                style: 'SECONDARY',
                                label: '-10%',
                                emoji: '🔉',
                                customId: volumeDown
                            });
                            const volumeResetBtn = new MessageButton({
                                style: 'SECONDARY',
                                label: 'Default',
                                emoji: '🔈',
                                customId: volumeBasic
                            });
                            const volumeAddBtn = new MessageButton({
                                style: 'SECONDARY',
                                label: '+10%',
                                emoji: '🔊',
                                customId: volumePlus
                            });

                            const volumeMessage = await interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("Change the volume with the buttons below this message!")
                                        .setColor(color)
                                ], fetchReply: true,
                                components: [new MessageActionRow({ components: [volumeMinBtn, volumeResetBtn, volumeAddBtn] })]
                            }).catch((err => { }))

                            const collectorVolume = volumeMessage.createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id });

                            collectorVolume.on('collect', async interaction => {

                                if (interaction.customId === volumeDown) {
                                    let newVol = queueVolume.volume - 10;
                                    if (newVol < 0) newVol = 0;

                                    client.distube.setVolume(interaction, newVol)

                                    await interaction.update({
                                        embeds: [
                                            new MessageEmbed()
                                                .setDescription(`🔉 Volume set to \`${newVol}%\``)
                                                .setColor(color)
                                        ]
                                    }).catch((err => { }))


                                } else if (interaction.customId === volumeBasic) {

                                    client.distube.setVolume(interaction, 50)

                                    await interaction.update({
                                        embeds: [
                                            new MessageEmbed()
                                                .setDescription(`🔈 Volume set to \`50%\``)
                                                .setColor(color)
                                        ]
                                    }).catch((err => { }))

                                } else if (interaction.customId === volumePlus) {
                                    let newVolAdd = queueVolume.volume + 10;
                                    if (newVolAdd > 100) newVolAdd = 100;

                                    client.distube.setVolume(interaction, newVolAdd)

                                    await interaction.update({
                                        embeds: [
                                            new MessageEmbed()
                                                .setDescription(`🔊 Volume set to \`${newVolAdd}%\``)
                                                .setColor(color)
                                        ]
                                    }).catch((err => { }))
                                }
                            });
                            break;

                        case 'shuffle':
                            const queueShuffle = client.distube.getQueue(interaction);
                            if (!queueShuffle) return interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("🎵 There are no songs playing!")
                                        .setColor(color)
                                ]
                            }).catch((err => { }))
                            client.distube.shuffle(interaction);
                            interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("🔀 Shuffled the queue!")
                                        .setColor(color)
                                ]
                            }).catch((err => { }))

                            break;

                        case 'resume':
                            const queueResume = client.distube.getQueue(interaction);
                            if (!queueResume) return interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("🎵 There are no songs playing!")
                                        .setColor(color)
                                ]
                            }).catch((err => { }))


                            client.distube.resume(interaction);
                            interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("▶️ Resumed!")
                                        .setColor(color)
                                ]
                            }).catch((err => { }))
                            break;

                        case 'pause':
                            const queuePause = client.distube.getQueue(interaction);
                            if (!queuePause) return interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("🎵 There are no songs playing!")
                                        .setColor(color)
                                ]
                            }).catch((err => { }))


                            client.distube.pause(interaction);
                            interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("⏸️ Paused!")
                                        .setColor(color)
                                ]
                            }).catch((err => { }))
                            break;

                        case 'nowplaying':
                            const queueNP = client.distube.getQueue(interaction);
                            if (!queueNP) return interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("🎵 There are no songs playing!")
                                        .setColor(color)
                                ]
                            }).catch((err => { }))

                            let song = queueNP.songs[0];

                            interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle("Now Playing")
                                        .setColor(color)
                                        .setDescription(`${song.name}`)
                                        .setThumbnail(song.thumbnail)
                                        .addField("Added by", `${song.user}`, true)
                                        .addField("Volume", `\`${queueNP.volume}%\``, true)
                                        .addField("Queue", `${queueNP.songs.length} song(s)`, true)
                                        .addField("Likes", `${song.likes}`, true)
                                        .addField("Views", `${song.views}`, true)
                                        .addField("Duration", `\`${song.formattedDuration}\``, true)
                                ]
                            }).catch((err => { }))

                            break;
                    }

                    break;
            }
        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
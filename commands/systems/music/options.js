const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "options",
    command: "music",
    async execute(client, interaction, color) {

        const Music = require('../../../structures/schemas/MusicSchema');
        const MusicDatabase = await Music.findOne({
            guildId: interaction.guild.id,
        }, (err, music) => {
            if (err) console.log(err);
            if (!music) {
                const newMusic = new Music({
                    guildId: interaction.guild.id,
                    musicEnabled: true,
                    oneChannel: "none",
                    oneChannelEnabled: false,
                    djRole: "none",
                    djEnabled: false,
                    djOnly: false,
                    djOnlyStop: false,
                    djOnlySkip: false,
                    djOnlyPause: false,
                    djOnlyResume: false,
                    djOnlyFilter: false,
                    djOnlyPlay: false,
                    djOnlySearch: false,
                    djOnlyQueue: false,
                    djOnlyRepeat: false,
                    djOnlyVolume: false,
                    djOnlySeek: false,
                    djOnlyShuffle: false,
                    djOnlyAutoplay: false,
                });
                newMusic.save();
            }
        }).clone().catch((err => { }));

        if (!MusicDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("Unable to get this server's music settings. Please try again.")
            ], ephemeral: true
        }).catch((err => { }));

        if (!MusicDatabase.musicEnabled) return interaction.reply({
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

        const djRole = interaction.guild.roles.cache.get(MusicDatabase.djRole);

        if (djRole && MusicDatabase.djEnabled && interaction.member.roles.cache.some(role => role === djRole)) {
            // They're a DJ
        } else {
            if (MusicDatabase.djOnly) {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(color)
                            .setDescription(`You are not a DJ! You need the ${djRole} role to perform this command.`)
                    ], ephemeral: true
                }).catch((err => { }));
                return;
            }
        }

        if (MusicDatabase.oneChannelEnabled && MusicDatabase.oneChannel) {
            const channel = interaction.guild.channels.cache.get(MusicDatabase.oneChannel);
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


        const option = interaction.options.getString("option");

        switch (option) {

            case "queue":

                // DJ System
                if (djRole && MusicDatabase.djEnabled && interaction.member.roles.cache.some(role => role === djRole)) {
                    // They're a DJ
                } else {
                    if (MusicDatabase.djOnlyQueue) {
                        interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(color)
                                    .setDescription(`You are not a DJ! You need the ${djRole} role to perform this command.`)
                            ], ephemeral: true
                        }).catch((err => { }));
                        return;
                    }
                }

                const queue = client.distube.getQueue(interaction);

                if (!queue) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription("🎵 | There are no songs playing!")
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription("🔃 | Getting queue")
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));

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
                }).catch((err => { }));
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
                    }).catch((err => { }));
                });

                break;

            case "stop":

                // DJ System
                if (djRole && MusicDatabase.djEnabled && interaction.member.roles.cache.some(role => role === djRole)) {
                    // They're a DJ
                } else {
                    if (MusicDatabase.djOnlyStop) {
                        interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(color)
                                    .setDescription(`You are not a DJ! You need the ${djRole} role to perform this command.`)
                            ], ephemeral: true
                        }).catch((err => { }));
                        return;
                    }
                }

                const queueStop = client.distube.getQueue(interaction);

                if (!queueStop) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription("🎵 | There are no songs playing!")
                            .setColor(color)
                    ]
                }).catch((err => { }));

                client.distube.stop(queueStop);
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription("⏹️ | Stopped the stream and left the voice channel!")
                            .setColor(color)
                    ]
                }).catch((err => { }));

                break;

            case "repeat":

                // DJ System
                if (djRole && MusicDatabase.djEnabled && interaction.member.roles.cache.some(role => role === djRole)) {
                    // They're a DJ
                } else {
                    if (MusicDatabase.djOnlyRepeat) {
                        interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(color)
                                    .setDescription(`You are not a DJ! You need the ${djRole} role to perform this command.`)
                            ], ephemeral: true
                        }).catch((err => { }));
                        return;
                    }
                }

                const queueRepeat = client.distube.getQueue(interaction);

                const repeatMessage = await interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`Currently: \`${queueRepeat.repeatMode ? queueRepeat.repeatMode === 2 ? "Repeat Queue" : "Repeat Song" : "Off"}\``)
                            .setColor(color)
                    ],
                    components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('repeat-off')
                                    .setLabel('Off')
                                    .setEmoji('▶️')
                                    .setStyle('SECONDARY'),
                                new MessageButton()
                                    .setCustomId('repeat-queue')
                                    .setLabel('Queue')
                                    .setEmoji('🔁')
                                    .setStyle('SECONDARY'),
                                new MessageButton()
                                    .setCustomId('repeat-song')
                                    .setLabel('Song')
                                    .setEmoji('🔂')
                                    .setStyle('SECONDARY'),
                            )
                    ], fetchReply: true
                }).catch((err => { }));

                const collectorRepeat = repeatMessage.createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id });

                collectorRepeat.on('collect', async interaction => {
                    if (interaction.customId === "repeat-off") {
                        client.distube.setRepeatMode(interaction, 0)
                        await interaction.update({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription("▶️ Turned repeat off!")
                                    .setColor(color)
                            ], components: []
                        }).catch((err => { }))
                    } else if (interaction.customId === "repeat-song") {
                        client.distube.setRepeatMode(interaction, 1)
                        await interaction.update({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription("🔂 Repeating song!")
                                    .setColor(color)
                            ], components: []
                        }).catch((err => { }))
                    } else if (interaction.customId === "repeat-queue") {
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

                break;

            case 'volume':

                // DJ System
                if (djRole && MusicDatabase.djEnabled && interaction.member.roles.cache.some(role => role === djRole)) {
                    // They're a DJ
                } else {
                    if (MusicDatabase.djOnlyVolume) {
                        interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(color)
                                    .setDescription(`You are not a DJ! You need the ${djRole} role to perform this command.`)
                            ], ephemeral: true
                        }).catch((err => { }));
                        return;
                    }
                }

                const queueVolume = client.distube.getQueue(interaction);
                if (!queueVolume) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription("🎵 There are no songs playing!")
                            .setColor(color)
                    ]
                }).catch((err => { }));

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

                if (!volumeMessage) return;

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
                        }).catch((err => { }));


                    } else if (interaction.customId === volumeBasic) {

                        client.distube.setVolume(interaction, 50)

                        await interaction.update({
                            embeds: [
                                new MessageEmbed()
                                    .setDescription(`🔈 Volume set to \`50%\``)
                                    .setColor(color)
                            ]
                        }).catch((err => { }));

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
                        }).catch((err => { }));
                    }
                });
                break;
        
        
            }

    }
}
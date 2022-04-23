const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

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
                    { name: "shuffle", value: "shuffle" },
                    { name: "resume", value: "resume" },
                    { name: "nowplaying", value: "nowplaying" },
                ]
            }],
        }
    ],
    async execute(client, interaction, color) {
        try {

            // music enabled check

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
                    }).catch(err => console.log(err));
                    return;
                }
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
                    }).catch(err => console.log(err));

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
                            });

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

                            interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("Select a repeat mode with the buttons below this message!")
                                        .setColor(color)
                                ],
                                components: [new MessageActionRow({ components: [repeatOff, repeatQueue, repeatOne] })]
                            });
                    }

                    break;
            }
        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
const { MessageEmbed } = require('discord.js');

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
            });

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
                            const queueQueue = client.distube.getQueue(interaction);

                            if (!queueQueue) return interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                        .setDescription("🎵 There are no songs playing!")
                                        .setColor(color)
                                ]
                            });

                            
                            break;

                    }

                    break;
            }
        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
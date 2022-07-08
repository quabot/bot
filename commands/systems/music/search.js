const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "search",
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

        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
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
                if (MusicDatabase.djOnlySearch) {
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

        const search = interaction.options.getString("search");
        const searches = await interaction.client.distube.search(search).catch((err => {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription("Couldn't find any songs!")
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));
        }));

        if (!searches) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription("Couldn't find any songs! You can't search for playlists.")
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        let description = "";

        for (let i = 0; i < searches.length; i++) {
            const element = searches[i];

            description = `${description}\n${i + 1}. ${element.name}`;
        }

        const msg = await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Pick a song by clicking the buttons below this message**${description}`)
                    .setColor(color)
            ], fetchReply: true,
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('music-1')
                            .setLabel('1️⃣')
                            .setDisabled(searches.length < 1)
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('music-2')
                            .setLabel('2️⃣')
                            .setDisabled(searches.length < 2)
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('music-3')
                            .setLabel('3️⃣')
                            .setDisabled(searches.length < 3)
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('music-4')
                            .setLabel('4️⃣')
                            .setDisabled(searches.length < 4)
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('music-5')
                            .setLabel('5️⃣')
                            .setDisabled(searches.length < 5)
                            .setStyle('SECONDARY'),
                    ),
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('music-6')
                            .setLabel('6️⃣')
                            .setDisabled(searches.length < 6)
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('music-7')
                            .setLabel('7️⃣')
                            .setDisabled(searches.length < 7)
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('music-8')
                            .setLabel('8️⃣')
                            .setDisabled(searches.length < 8)
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('music-9')
                            .setLabel('9️⃣')
                            .setDisabled(searches.length < 9)
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('music-10')
                            .setLabel('🔟')
                            .setDisabled(searches.length < 10)
                            .setStyle('SECONDARY'),
                    )
            ]
        }).catch((err => { }));

        const voiceChannel = member.voice.channel;
        const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

        collector.on('collect', async interaction => {
            const customId = `${interaction.customId}`;
            const songNumber = parseInt(customId.slice(6)) - 1;

            const songUrl = searches[songNumber].url;

            client.distube.play(voiceChannel, `${songUrl}`, {
                textChannel: interaction.channel,
            }).catch((err => {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription("Couldn't find any songs!")
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));
            }));

            interaction.update({
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('music-1')
                                .setLabel('1️⃣')
                                .setDisabled(true)
                                .setStyle(customId === 'music-1' ? "SUCCESS" : "SECONDARY"),
                            new MessageButton()
                                .setCustomId('music-2')
                                .setLabel('2️⃣')
                                .setDisabled(true)
                                .setStyle(customId === 'music-2' ? "SUCCESS" : "SECONDARY"),
                            new MessageButton()
                                .setCustomId('music-3')
                                .setLabel('3️⃣')
                                .setDisabled(true)
                                .setStyle(customId === 'music-3' ? "SUCCESS" : "SECONDARY"),
                            new MessageButton()
                                .setCustomId('music-4')
                                .setLabel('4️⃣')
                                .setDisabled(true)
                                .setStyle(customId === 'music-4' ? "SUCCESS" : "SECONDARY"),
                            new MessageButton()
                                .setCustomId('music-5')
                                .setLabel('5️⃣')
                                .setDisabled(true)
                                .setStyle(customId === 'music-5' ? "SUCCESS" : "SECONDARY"),
                        ),
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('music-6')
                                .setLabel('6️⃣')
                                .setDisabled(true)
                                .setStyle(customId === 'music-6' ? "SUCCESS" : "SECONDARY"),
                            new MessageButton()
                                .setCustomId('music-7')
                                .setLabel('7️⃣')
                                .setDisabled(true)
                                .setStyle(customId === 'music-7' ? "SUCCESS" : "SECONDARY"),
                            new MessageButton()
                                .setCustomId('music-8')
                                .setLabel('8️⃣')
                                .setDisabled(true)
                                .setStyle(customId === 'music-8' ? "SUCCESS" : "SECONDARY"),
                            new MessageButton()
                                .setCustomId('music-9')
                                .setLabel('9️⃣')
                                .setDisabled(true)
                                .setStyle(customId === 'music-9' ? "SUCCESS" : "SECONDARY"),
                            new MessageButton()
                                .setCustomId('music-10')
                                .setLabel('🔟')
                                .setDisabled(true)
                                .setStyle(customId === 'music-10' ? "SUCCESS" : "SECONDARY"),
                        )
                ]
            })

        });

    }
}
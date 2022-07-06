const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    id: "music-skip",
    async execute(interaction, client, color) {

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
            if (MusicDatabase.djOnlySkip) {
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

        const queue = client.distube.getQueue(interaction);

        if (!queue) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription("🎵 | There are no songs playing!")
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        if (!queue.songs[1]) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription("🎵 | There is no next song!")
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));

        client.distube.skip(queue);
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription("⏭️ | Skipped a song!")
                    .setColor(color)
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('music-volume-down')
                            .setLabel('🔉')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('music-volume-up')
                            .setLabel('🔊')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('music-playpause')
                            .setLabel('⏯️')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('music-stop')
                            .setLabel('⏹️')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('music-skip')
                            .setLabel('⏭️')
                            .setStyle('SECONDARY'),
                    )
            ]
        }).catch((err => { }));
    }
}
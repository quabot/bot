const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "play",
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
                    djOnlyStop: true,
                    djOnlySkip: false,
                    djOnlyPause: true,
                    djOnlyResume: true,
                    djOnlyFilter: true,
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

        const gMember = interaction.guild.members.cache.get(interaction.user.id);
        if (!gMember.voice.channel) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Please join a voice channel to use the music commands.`)
                    .setColor(color)
            ]
        })
        if (gMember.voice.channelId !== interaction.guild.me.voice.channelId) {
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
            console.log("UR A DJ")
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
          
        // one channel

        const member = interaction.guild.members.cache.get(interaction.user.id);

        const search = interaction.options.getString("search");

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription("Request recieved!")
                    .setColor(color)
            ], ephemeral: true
        });

        const voiceChannel = member.voice.channel;
        client.distube.play(voiceChannel, `${search}`, {
            textChannel: interaction.channel,
        }).catch((err => { }));

    }
}
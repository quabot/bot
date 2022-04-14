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

            if (interaction.guild.me.voice.channelId) {
                console.log("in vc fucker")
            }
            if (member.voice.channelId !== interaction.guild.me.voice.channelId) {
                if (interaction.guild.me.voice.channelId) {
                    console.log("not same vc")
                }
            }
            if (member.voice.channelId === interaction.guild.me.voice.channelId) {
                console.log("same vc")
            }

            
            const voiceChannel = member.voice.channel;
            client.distube.playVoiceChannel(voiceChannel, "Daft punk", {
                textChannel: interaction.channel,
            }).catch(err => console.log(err));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
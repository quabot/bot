const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "play",
    command: "music",
    async execute(client, interaction, color) {

        // one channel mode, music enabled and dj role

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
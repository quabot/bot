const discord = require('discord.js');
const DisTube = require('distube');

const Guild = require('../../models/guild');
const colors = require('../../files/colors.json');
const { errorMain, addedDatabase, NotInVC, MusicIsDisabled } = require('../../files/embeds');

module.exports = {
    name: "nowplaying",
    description: "Get informations about the currently playing song.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
    ],
    async execute(client, interaction) {

        const settings = await Guild.findOne({
            guildID: interaction.guild.id
        }, (err, guild) => {
            if (err) interaction.reply({ embeds: [errorMain] });
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    logChannelID: none,
                    enableLog: true,
                    enableSwearFilter: false,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: "Muted",
                    mainRoleName: "Member",
                    reportEnabled: true,
                    reportChannelID: none,
                    suggestEnabled: true,
                    suggestChannelID: none,
                    ticketEnabled: true,
                    ticketChannelName: "Tickets",
                    closedTicketCategoryName: "Closed Tickets",
                    welcomeEnabled: true,
                    welcomeChannelID: none,
                    enableNSFWContent: false,
                });

                newGuild.save()
                    .catch(err => interaction.reply({ embeds: [errorMain] }));

                return interaction.reply({ embeds: [addedDatabase] });
            }
        });
        if (settings.enableMusic === "false") return interaction.reply({ embeds: [MusicIsDisabled] });

        const member = interaction.guild.members.cache.get(interaction.user.id);
        if (!member.voice.channel) return interaction.reply({ embeds: [NotInVC]});

        const queue = client.player.getQueue(interaction);
        if(!queue) return interaction.reply("There are no songs playing! Play a song first. (new message soon)");

        let song = queue.songs[0];
        if (!song) return interaction.reply("There are no songs playing! Play a song first. (new message soon)");

        const playingEmbed = new discord.MessageEmbed()
            .setTitle("Now Playing")
            .setColor(colors.COLOR)
            .setDescription(`${song.name}`)
            .setThumbnail(song.thumbnail)
            .addField("Added by", `${song.user}`, true)
            .addField("Volume", `\`${queue.volume}%\``, true)
            .addField("Queue", `${queue.songs.length} song(s)`, true)
            .addField("Likes", `${song.likes}`, true)
            .addField("Dislikes", `${song.dislikes}`, true)
            .addField("Views", `${song.views}`, true)
            .addField("Duration", `\`${song.formattedDuration}\``, true)
        interaction.reply({ embeds: [playingEmbed] });

    }
}
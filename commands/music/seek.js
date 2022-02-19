const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { musicDisabled, notVoice, noSongs } = require('../../embeds/music');
const { COLOR_MAIN } = require('../../files/colors.json');
const { skipButtons } = require('../../interactions/music');

module.exports = {
    name: "seek",
    description: "Seek to a point in the song.",
    options: [
        {
            name: "seconds",
            description: "Time in seconds",
            type: "INTEGER",
            required: true,
        }
    ],
    async execute(client, interaction) {

        try {
            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        logChannelID: "none",
                        reportChannelID: "none",
                        suggestChannelID: "none",
                        welcomeChannelID: "none",
                        levelChannelID: "none",
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log("Error!"));
                }
            }).clone().catch(function (err) { console.log(err) });
            if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [musicDisabled] }).catch(err => console.log("Error!"));

            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member.voice.channel) return interaction.reply({ embeds: [NotInVC] });
            const queue = client.player.getQueue(interaction);
            if (!queue) return interaction.reply({ embeds: [noSongs] });

        
            const volumeNew = interaction.options.getInteger('seconds');
            if (volumeNew <= 0) return interaction.reply({ content: "Please enter a value between 0-10000s!" }).catch(err => console.log("Error!"));
            if (volumeNew >= 10000) return interaction.reply({ content: "Please enter a value between 0-10000s!" }).catch(err => console.log("Error!"));

            client.player.seek(interaction, Number(volumeNew));
            const embed = new MessageEmbed()
                .setTitle("Seeked song!")
                .setDescription(`Seeked song to: **${Number(volumeNew)}**`)
                .setColor(COLOR_MAIN)
                .setTimestamp()
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: join`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}
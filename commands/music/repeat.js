const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { musicDisabled, notVoice, noSongs } = require('../../embeds/music');
const { COLOR_MAIN } = require('../../files/colors.json');
const { skipButtons } = require('../../interactions/music');

module.exports = {
    name: "repeat",
    description: "Alter repeat mode.",
    options: [
        {
            name: "repeatmode",
            description: "0 - OFF, 1 - REPEAT SONG or 2 - REPEAT QUEUE",
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
                        transcriptChannelID: "none"
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
            if (!member.voice.channel) return interaction.reply({ embeds: [notVoice] }).catch(err => console.log("Error!"));

            const queue = client.player.getQueue(interaction);
            if (!queue) return interaction.reply({ embeds: [noSongs] });
            const newMode = interaction.options.getInteger('repeatmode');
            if (newMode === 0 || newMode === 1 || newMode === 2) {
                let mode = client.player.setRepeatMode(interaction, newMode);
                mode = mode ? mode == 2 ? "Repeat queue :repeat:" : "Repeat song :repeat_one:" : "Off :arrow_forward:";

                const embed = new MessageEmbed()
                    .setTitle(":repeat:  Changed repeat mode!")
                    .setDescription(`${mode}`)
                    .setColor(COLOR_MAIN)
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } else {
                return interaction.reply({ content: "No valid mode found.", components: [skipButtons] });
            }
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: join`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}
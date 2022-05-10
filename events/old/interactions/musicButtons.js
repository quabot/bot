const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const { musicDisabled, notVoice, noSongs } = require('../../embeds/music');
const { COLOR_MAIN } = require('../../files/colors.json');
const { skipButtons, pausedButtons } = require('../../interactions/music');

const { error, added } = require('../../embeds/general.js');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.guild.id === null) return;

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
                        punishmentChannelID: "none",
                        pollID: 0,
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
                        welcomeEmbed: true,
                        pollEnabled: true,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        leaveEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }).clone().catch(function (err) { console.log(err) });

            if (interaction.isButton()) {
                if (interaction.customId === "pause-song") {
                    if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [musicDisabled] }).catch(err => console.log(err));

                    const member = interaction.guild.members.cache.get(interaction.user.id);
                    if (!member.voice.channel) return interaction.reply({ embeds: [notVoice] }).catch(err => console.log(err));
                    const queue = client.player.getQueue(interaction);
                    if (!queue) return interaction.reply({ embeds: [noSongs] }).catch(err => console.log(err));

                    client.player.pause(interaction);
                    const pausedEmbed = new MessageEmbed()
                        .setTitle("⏯️ Paused the music stream!")
                        .setColor(COLOR_MAIN)
                    interaction.reply({ embeds: [pausedEmbed], components: [pausedButtons] }).catch(err => console.log(err));
                }

                if (interaction.customId === "resume-song") {
                    if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [musicDisabled] }).catch(err => console.log(err));

                    const member = interaction.guild.members.cache.get(interaction.user.id);
                    if (!member.voice.channel) return interaction.reply({ embeds: [notVoice] }).catch(err => console.log(err));
                    const queue = client.player.getQueue(interaction);
                    if (!queue) return interaction.reply({ embeds: [noSongs] }).catch(err => console.log(err));

                    client.player.resume(interaction);
                }

                if (interaction.customId === "skip-song") {
                    if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [musicDisabled] }).catch(err => console.log(err));

                    const member = interaction.guild.members.cache.get(interaction.user.id);
                    if (!member.voice.channel) return interaction.reply({ embeds: [notVoice] }).catch(err => console.log(err));
                    const queue = client.player.getQueue(interaction);
                    if (!queue) return interaction.reply({ embeds: [noSongs] }).catch(err => console.log(err));

                    client.player.skip(queue);

                    const embed = new MessageEmbed()
                        .setTitle(`⏭️ Skipped a song!`)
                        .setColor(COLOR_MAIN);
                    interaction.reply({ embeds: [embed] }).catch(err => console.log(err));
                }

                if (interaction.customId === "stop-song") {
                    if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [musicDisabled] }).catch(err => console.log(err));

                    const member = interaction.guild.members.cache.get(interaction.user.id);
                    if (!member.voice.channel) return interaction.reply({ embeds: [notVoice] }).catch(err => console.log(err));
                    const queue = client.player.getQueue(interaction);
                    if (!queue) return interaction.reply({ embeds: [noSongs] }).catch(err => console.log(err));

                    client.player.stop(interaction);

                    const embed = new MessageEmbed()
                        .setTitle(`⏹️ Stopped the music stream!`)
                        .setColor(COLOR_MAIN);
                    interaction.reply({ embeds: [embed] }).catch(err => console.log(err));
                }

                if (interaction.customId === "shuffle-song") {
                    if (guildDatabase.musicEnabled === "false") return interaction.reply({ embeds: [musicDisabled] }).catch(err => console.log(err));

                    const member = interaction.guild.members.cache.get(interaction.user.id);
                    if (!member.voice.channel) return interaction.reply({ embeds: [notVoice] }).catch(err => console.log(err));
                    const queue = client.player.getQueue(interaction);
                    if (!queue) return interaction.reply({ embeds: [noSongs] }).catch(err => console.log(err));
        
                    client.player.shuffle(interaction);
        
                    const embed = new MessageEmbed()
                        .setTitle(`🔀 Shuffled the queue!`)
                        .setColor(COLOR_MAIN);
                    interaction.reply({ embeds: [embed] }).catch(err => console.log(err));
                }

                if (interaction.customId === "repeat-song") {
                    const embed = new MessageEmbed()
                        .setTitle(`That button is not supported at this time!`)
                        .setColor(COLOR_MAIN);
                    interaction.reply({ ephemeral: true, embeds: [embed] }).catch(err => console.log(err));
                }
            };
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: clear`)] }).catch(err => console.log(err));
            return;
        }
    }
}
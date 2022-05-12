const { MessageEmbed } = require('discord.js');
const ms = require('ms');

const { error, added } = require('../../embeds/general');
const { noChannel } = require('../../embeds/management');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "unlock",
    description: "Unlock a channel.",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "channel",
            description: "Channel to lock (when none is given, current channel is locked.",
            required: false,
            type: "CHANNEL",
        },
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
                        punishmentChannelID: "none",
                        pollID: 0,
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                    modEnabled: true,
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
                        mainRole: "none",
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
                            interaction.channel.send({ embeds: [error] }).catch(( err => { } ))
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(( err => { } ))
                }
            }).clone().catch(function (err) { console.log(err) });

            let channel = interaction.options.getChannel('channel');
            if (!channel) channel = interaction.channel;

            const role = interaction.guild.roles.cache.find(role => role.id === `${guildDatabase.mainRole}`);

            if (channel.type === "GUILD_TEXT") {
                if (role) channel.permissionOverwrites.edit(role, { SEND_MESSAGES: true }).catch(( err => { } ))
                channel.permissionOverwrites.edit(interaction.guild.id, { SEND_MESSAGES: true }).catch(( err => { } ))
                const locked = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🔓 Channel unlocked!").addField("Unlocked by", `${interaction.user}`);
                channel.send({ embeds: [locked] }).catch(( err => { } ))
                const reply = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🔓 Channel unlocked!").setDescription(`Succesfully unlocked ${channel}.`);
                interaction.reply({ ephemeral: true, embeds: [reply] }).catch(( err => { } ))

            } else if (channel.type === "GUILD_VOICE") {
                if (role) channel.permissionOverwrites.edit(role, { CONNECT: true, SPEAK: true }).catch(( err => { } ))
                    channel.permissionOverwrites.edit(interaction.guild.id, { CONNECT: true, SPEAK: true }).catch(( err => { } ))
                    const reply = new MessageEmbed().setColor(COLOR_MAIN).setTitle("🔓 Voice Channel unlocked!").setDescription(`${channel}`).addField("Unlocked by", `${interaction.user}`);
                    interaction.reply({ embeds: [reply] }).catch(( err => { } ))
            } else {
                interaction.reply({ embeds: [noChannel] }).catch(( err => { } ))
            }

            if (!guildDatabase) return;

            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                if (!logChannel) return;

                const embed = new MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle('🔓 Channel Unlocked')
                    .addField('Channel', `${channel}`)
                    .addField('Unlocked by', `${interaction.user}`)
                logChannel.send({ embeds: [embed] }).catch(( err => { } ))
            } else {
                return;
            }

        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(( err => { } ))
            console.log(e)
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: lock`)] }).catch(( err => { } ))
            return;
        }
    }
}
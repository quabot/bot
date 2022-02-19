const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { error, added } = require('../../embeds/general.js');
const { noPermission, toggledEmbed } = require('../../embeds/config');
const { disabled } = require('../../interactions/config');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
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

            const Events = require('../../schemas/EventsSchema')
            const eventsDatabase = await Events.findOne({
                guildId: interaction.guild.id
            }, (err, events) => {
                if (err) console.error(err)
                if (!events) {
                    const newEvents = new Events({
                        guildId: interaction.guild.id,
                        guildName: interaction.guild.name,
                        joinMessages: true,
                        leaveMessages: true,
                        channelCreateDelete: true,
                        channelUpdate: true,
                        emojiCreateDelete: true,
                        emojiUpdate: true,
                        inviteCreateDelete: true,
                        messageDelete: true,
                        messageUpdate: true,
                        roleCreateDelete: true,
                        roleUpdate: true,
                        voiceState: false,
                        voiceMove: false,
                        memberUpdate: true,
                        quabotLogging: true
                    })
                    newEvents.save().catch(err => {
                        console.log(err)
                        interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                    })
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log("Error!"));
                }
            }
            ).clone().catch(function (err) { console.log(err) });

            if (interaction.isButton()) {
                if (interaction.customId === "enableJoinMsg") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        joinMessages: true
                    });
                    toggledEmbed.setDescription("Succesfully enabled join messages.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "disableJoinMsg") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        joinMessages: false
                    });
                    toggledEmbed.setDescription("Succesfully disabled join messages.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "enableLeaveMsg") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        leaveMessages: true
                    });
                    toggledEmbed.setDescription("Succesfully enabled leave messages.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "disableLeaveMsg") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        leaveMessages: false
                    });
                    toggledEmbed.setDescription("Succesfully disabled leave messages.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "enableChannelCD") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        channelCreateDelete: true
                    });
                    toggledEmbed.setDescription("Succesfully enabled channel create and deletion logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "disableChannelCD") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        channelCreateDelete: false
                    });
                    toggledEmbed.setDescription("Succesfully disabled channel create and deletion logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "enableChannelUpdate") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        channelUpdate: true
                    });
                    toggledEmbed.setDescription("Succesfully enabled channel update logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "disableChannelUpdate") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        channelUpdate: false
                    });
                    toggledEmbed.setDescription("Succesfully disabled channel update logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "enableEmoji") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        emojiCreateDelete: true
                    });
                    toggledEmbed.setDescription("Succesfully enabled emoji creation and deletion logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "disableEmoji") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        emojiCreateDelete: false
                    });
                    toggledEmbed.setDescription("Succesfully disabled emoji creation and deletion logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "enableEmojiU") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        emojiUpdate: true
                    });
                    toggledEmbed.setDescription("Succesfully enabled emoji update logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "disableEmojiU") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        emojiUpdate: false
                    });
                    toggledEmbed.setDescription("Succesfully disabled emoji update logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "enableInvite") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        inviteCreateDelete: true
                    });
                    toggledEmbed.setDescription("Succesfully enabled invite creation and deletion logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "disableInvite") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        inviteCreateDelete: false
                    });
                    toggledEmbed.setDescription("Succesfully disabled invite creation and deletion logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "enableMessageD") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        messageDelete: true
                    });
                    toggledEmbed.setDescription("Succesfully enabled message deletion logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "disableMessageD") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        messageDelete: false
                    });
                    toggledEmbed.setDescription("Succesfully disable message deletion logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "enableMessageU") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        messageUpdate: true
                    });
                    toggledEmbed.setDescription("Succesfully enabled message update logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "disableMessageU") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        messageUpdate: false
                    });
                    toggledEmbed.setDescription("Succesfully disable message update logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "enableRoleC") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        roleCreateDelete: true
                    });
                    toggledEmbed.setDescription("Succesfully enabled role creation & deletion logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "disableRoleC") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        roleCreateDelete: false
                    });
                    toggledEmbed.setDescription("Succesfully disabled role creation & deletion logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "enableRoleU") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        roleUpdate: true
                    });
                    toggledEmbed.setDescription("Succesfully enabled role update logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "disableRoleU") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        roleUpdate: false
                    });
                    toggledEmbed.setDescription("Succesfully disabled role update logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "enableVoiceJL") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        voiceState: true
                    });
                    toggledEmbed.setDescription("Succesfully enabled voice state logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "disableVoiceJL") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        voiceState: false
                    });
                    toggledEmbed.setDescription("Succesfully disabled voice state logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "enableVoiceM") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        voiceMove: true
                    });
                    toggledEmbed.setDescription("Succesfully enabled voice move logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "disableVoiceM") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        voiceMove: false
                    });
                    toggledEmbed.setDescription("Succesfully disabled voice move logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "enableMemberU") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        memberUpdate: true
                    });
                    toggledEmbed.setDescription("Succesfully enabled member update logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "disableMemberU") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        memberUpdate: false
                    });
                    toggledEmbed.setDescription("Succesfully disabled member update logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "enableBotL") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        quabotLogging: true
                    });
                    toggledEmbed.setDescription("Succesfully enabled bot logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }

                if (interaction.customId === "disableBotL") {
                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log("Error!"));
                    await eventsDatabase.updateOne({
                        quabotLogging: false
                    });
                    toggledEmbed.setDescription("Succesfully disabled bot logs.");
                    interaction.update({ ephemeral: true, embeds: [toggledEmbed], components: [disabled] }).catch(err => console.log("Error!"));
                }
            };
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: clear`)] }).catch(err => console.log("Error!"));
            return;
        }
    }
}
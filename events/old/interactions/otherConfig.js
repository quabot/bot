const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { noPermission, timedOut } = require('../../embeds/config');
const { error, added } = require('../../embeds/general.js');

const { buttonsLevel } = require('../../interactions/config');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {

        if (interaction.guild.id === null) return;

        try {
            const filter = m => interaction.user === m.author;
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

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
                        pollEnabled: true,
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


            if (interaction.isSelectMenu()) {
                if (interaction.values[0] === "welcome_msg") {

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log(err));

                    let joinmessage = guildDatabase.joinMessage;

                    if (joinmessage === undefined) joinmessage = "Welcome {user} to **{guild-name}**"

                    joinmessage = joinmessage.replace("{user}", interaction.user);
                    joinmessage = joinmessage.replace("{user-name}", interaction.user.username);
                    joinmessage = joinmessage.replace("{user-discriminator}", interaction.user.discriminator);
                    joinmessage = joinmessage.replace("{guild-name}", interaction.guild.name);
                    joinmessage = joinmessage.replace("{members}", interaction.guild.memberCount);


                    const welcome = new MessageEmbed()
                        .setTitle("Change Welcome Message")
                        .setDescription("Send the new welcome message within 60 seconds to change it.")
                        .addField("Variables to use", "**{user}** - mentions the user\n**{user-name}** - The users name\n**{user-discriminator}** - Sends the users discriminator\n**{guild-name}** - Sends the guild name\n**{members}** - Guild's membercount.")
                        .addField("Current message", `${joinmessage}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/0vCe2oB.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log(err));
                    interaction.reply({ embeds: [welcome], ephemeral: true }).catch(err => console.log(err));
                    collector.on('collect', async m => {
                        if (m) {
                            const C = m.content;
                            if (!C) return;
                            if (m.content.length > 1020) return m.reply("That message is too long.").catch(err => console.log(err));

                            let newmsg = C;

                            if (newmsg === undefined) newmsg = "Welcome {user} to **{guild-name}**"

                            newmsg = newmsg.replace("{user}", m.author);
                            newmsg = newmsg.replace("{user-name}", m.author.username);
                            newmsg = newmsg.replace("{user-discriminator}", m.author.discriminator);
                            newmsg = newmsg.replace("{guild-name}", m.guild.name);
                            joinmessage = joinmessage.replace("{members}", interaction.guild.memberCount);

                            await guildDatabase.updateOne({
                                joinMessage: C
                            });

                            const updated = new MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed welcome message to: ${C}. Example in use:`)
                                .setColor(COLOR_MAIN)
                            m.channel.send({ embeds: [updated] }).catch(err => console.log(err));

                            const welcomeEmbed = new MessageEmbed()
                                .setAuthor(`${m.author.tag} just joined!`, m.author.avatarURL())
                                .setDescription(`${newmsg}`)
                                .setColor(`GREEN`);
                            setTimeout(() => {
                                m.channel.send({ embeds: [welcomeEmbed] }).catch(err => console.log(err));
                            }, 500);

                            collector.stop();
                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] }).catch(err => console.log(err));
                        }
                    });
                }
                if (interaction.values[0] === "leave_msg") {

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log(err));

                    let leavemessage = guildDatabase.leaveMessage;

                    if (leavemessage === undefined) leavemessage = "Goodbye {user}!"

                    leavemessage = leavemessage.replace("{user}", interaction.user);
                    leavemessage = leavemessage.replace("{user-name}", interaction.user.username);
                    leavemessage = leavemessage.replace("{user-discriminator}", interaction.user.discriminator);
                    leavemessage = leavemessage.replace("{guild-name}", interaction.guild.name);

                    leavemessage = leavemessage.replace("{members}", interaction.guild.memberCount);


                    const welcome = new MessageEmbed()
                        .setTitle("Change Leave Message")
                        .setDescription("Send the new leave message within 60 seconds to change it.")
                        .addField("Variables to use", "**{user}** - mentions the user\n**{user-name}** - The users name\n**{user-discriminator}** - Sends the users discriminator\n**{guild-name}** - Sends the guild name\n**{members}** - Current guild member count.")
                        .addField("Current message", `${leavemessage}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/0vCe2oB.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log(err));
                    interaction.reply({ embeds: [welcome], ephemeral: true }).catch(err => console.log(err));
                    collector.on('collect', async m => {
                        if (m) {
                            const C = m.content;
                            if (!C) return;
                            if (m.content.length > 1020) return m.reply("That message is too long.").catch(err => console.log(err));

                            let newmsg = C;

                            if (newmsg === undefined) newmsg = "Goodbye {user}!"

                            newmsg = newmsg.replace("{user}", m.author);
                            newmsg = newmsg.replace("{user-name}", m.author.username);
                            newmsg = newmsg.replace("{user-discriminator}", m.author.discriminator);
                            newmsg = newmsg.replace("{guild-name}", m.guild.name);

                            await guildDatabase.updateOne({
                                leaveMessage: C
                            });

                            const updated = new MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed leave message to: ${C}. Example in use:`)
                                .setColor(COLOR_MAIN)
                            m.channel.send({ embeds: [updated] }).catch(err => console.log(err));

                            const leaveEmbed = new MessageEmbed()
                                .setAuthor(`${m.author.tag} just left!`, m.author.avatarURL())
                                .setDescription(`${newmsg}`)
                                .setColor(`RED`);
                            setTimeout(() => {
                                m.channel.send({ embeds: [leaveEmbed] }).catch(err => console.log(err));
                            }, 500);

                            collector.stop();
                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] }).catch(err => console.log(err));
                        }
                    });
                }

                if (interaction.values[0] === "eco_prefix") {

                    let prefix = guildDatabase.prefix;
                    if (!prefix) prefix = "!";

                    const economy = new MessageEmbed()
                        .setTitle("Change Prefix")
                        .setDescription(`Send the new prefix within 60 seconds to change it. Currently: ${prefix}`)
                        .setColor(COLOR_MAIN)
                        .setThumbnail("https://i.imgur.com/0vCe2oB.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] }).catch(err => console.log(err));
                    interaction.reply({ embeds: [economy], ephemeral: true }).catch(err => console.log(err));
                    collector.on('collect', async m => {
                        if (m) {
                            const C = m.content;
                            if (!C) return;
                            if (m.content.length > 10) return m.reply("That prefix is too long.").catch(err => console.log(err));

                            await guildDatabase.updateOne({
                                prefix: C
                            });

                            const updated = new MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed prefix to: ${C}`)
                                .setColor(COLOR_MAIN)
                            m.channel.send({ embeds: [updated] }).catch(err => console.log(err));

                            collector.stop();
                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] }).catch(err => console.log(err));
                        }
                    });
                }
            }

        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: clear`)] }).catch(err => console.log(err));
            return;
        }
    }
}
const { CommandInteraction, MessageButton, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');

const { role, noPermission } = require('../../files/embeds/config');
const { errorMain, addedDatabase } = require('../../files/embeds.js');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.guild.id === null) return;

        try {
            const Guild = require('../../schemas/GuildSchema')
            const guildDatabase = await Guild.findOne({
                guildId: interaction.guild.id
            },
                (err, guild) => {
                    if (err) console.error(err)
                    if (!guild) {
                        const newGuild = new Guild({
                            guildId: interaction.guild.id,
                            guildName: interaction.guild.name,
                            logChannelID: 'none',
                            reportChannelID: 'none',
                            suggestChannelID: 'none',
                            welcomeChannelID: 'none',
                            levelChannelID: 'none',
                            pollChannelID: 'none',
                            ticketCategory: 'Tickets',
                            closedTicketCategory: 'Tickets',
                            logEnabled: true,
                            musicEnabled: true,
                            levelEnabled: true,
                            reportEnabled: true,
                            suggestEnabled: true,
                            joinMessage: "Welcome {user} to **{guild-name}**!",
                            leaveMessage: "Goodbye {user}!"
                        })
                        newGuild.save().catch(err => {
                            console.log(err)
                            interaction.channel.send({ embeds: [errorMain] })
                        })
                        return interaction.channel.send({ embeds: [addedDatabase] })
                    }
                }
            );

            const filter = m => interaction.user === m.author;
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

            if (interaction.isSelectMenu()) {
                if (interaction.values[0] === "welcome_msg") {

                    let joinmessage = guildDatabase.joinMessage;

                    if (joinmessage === undefined) joinmessage = "Welcome {user} to **{guild-name}**"

                    joinmessage = joinmessage.replace("{user}", interaction.user);
                    joinmessage = joinmessage.replace("{user-name}", interaction.user.username);
                    joinmessage = joinmessage.replace("{user-discriminator}", interaction.user.discriminator);
                    joinmessage = joinmessage.replace("{guild-name}", interaction.guild.name);


                    const welcome = new MessageEmbed()
                        .setTitle("Change Welcome Message")
                        .setDescription("Send the new welcome message within 60 seconds to change it.")
                        .addField("Variables to use", "**{user}** - mentions the user\n**{user-name}** - The users name\n**{user-discriminator}** - Sends the users discriminator\n**{guild-name}** - Sends the guild name")
                        .addField("Current message", `${joinmessage}`)
                        .setColor(colors.COLOR)
                        .setThumbnail("https://i.imgur.com/jgdQUul.png");

                    if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ ephemeral: true, embeds: [noPermission] });
                    interaction.reply({ embeds: [welcome], ephemeral: true });
                    collector.on('collect', async m => {
                        if (m) {
                            const C = m.content;
                            if (!C) return;
                            if (m.content.length > 1020) return m.reply("That message is too long.");

                            let newmsg = C;

                            if (newmsg === undefined) newmsg = "Welcome {user} to **{guild-name}**"

                            newmsg = newmsg.replace("{user}", m.author);
                            newmsg = newmsg.replace("{user-name}", m.author.username);
                            newmsg = newmsg.replace("{user-discriminator}", m.author.discriminator);
                            newmsg = newmsg.replace("{guild-name}", m.guild.name);

                            await guildDatabase.updateOne({
                                joinMessage: C
                            });

                            const updated = new MessageEmbed()
                                .setTitle(":white_check_mark: Succes!")
                                .setDescription(`Changed welcome message to ${C}. Example in use:`)
                                .setColor(colors.COLOR)
                            m.channel.send({ embeds: [updated] })

                            const welcomeEmbed = new MessageEmbed()
                                .setAuthor(`${m.author.tag} just joined!`, m.author.avatarURL())
                                .setDescription(`${newmsg}`)
                                .setColor(colors.JOIN_COLOR);
                            setTimeout(() => {
                                m.channel.send({ embeds: [welcomeEmbed] });
                            }, 500);

                            collector.stop();
                            return;
                        } else {
                            if (m.author.bot) return;
                            m.reply({ embeds: [timedOut] });
                        }
                    });
                }
            }

        } catch (e) {
            console.log(e);
            interaction.channel.send({ embeds: [errorMain] });
            return;
        }
    }
}
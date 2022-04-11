const config = require('../../files/settings.json');
const mongoose = require('mongoose');
const consola = require('consola');
const Discord = require('discord.js');
const { SlashCommands } = require('../../files/commands');
const { COLOR_MAIN} = require('../../files/colors.json')
module.exports = {
    name: "messageCreate",
    async execute(message, client) {


        try {
            const { MessageEmbed } = require('discord.js')
            const guildId = message.guild.id;

            if (guildId === null) return;

            const Guild = require('../../schemas/GuildSchema');
            const guildDatabase = await Guild.findOne({
                guildId: message.guild.id,
            }, (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        guildId: message.guild.id,
                        guildName: message.guild.name,
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
                        });
                    return;
                }
            }).clone().catch(function (err) { console.log(err) });

            if (!guildDatabase) return;
            
            let prefix = guildDatabase.prefix;
            if (!prefix) prefix = "!";
            if (!message.content.startsWith(prefix) || message.author.bot) return;

            const args = message.content.slice(prefix.length).split(/ +/);
            const cmd = args.shift().toLowerCase();

            if (SlashCommands.includes(cmd)) return message.reply({ embeds: [new Discord.MessageEmbed().setColor(COLOR_MAIN).setDescription(`<:ezgif:941723896871276594> Please use a **/** to execute that command!\nExample: \`/${cmd}\``)], allowedMentions: {repliedUser: false} })

            const command = client.commands.get(cmd) ||
                client.commands.find(a => a.aliases && a.aliases.includes(cmd));;

            if (!command.economy) return;
            if (command) {
                command.execute(client, message, args);
                client.guilds.cache.get('847828281860423690').channels.cache.get('948192914603933716').send({ embeds: [new MessageEmbed().setDescription(`**${message.author.username}#${message.author.discriminator}** used **${command.name}** in **${message.guild.name}**`)] }).catch(err => console.log(err));;
                consola.info(`!${command.name} was used`);
            }

        } catch (e) {
            return;
        }
    }
}
const discord = require('discord.js');
const DisTube = require('distube');

const Guild = require('../../models/guild');
const colors = require('../../files/colors.json');
const { errorMain, addedDatabase, NotInVC, MusicDisabled } = require('../../files/embeds');

module.exports = {
    name: "join",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `join` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) message.channel.send({ embeds: [errorMain] });
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: config.PREFIX,
                    logChannelID: none,
                    enableLog: false,
                    enableSwearFilter: true,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: muted,
                    mainRoleName: member
                });

                newGuild.save()
                    .catch(err => message.channel.send({ embeds: [errorMain] }));

                return message.channel.send({ embeds: [addedDatabase] });
            }
        });

        if (settings.enableMusic === "false") return message.channel.send({ embeds: [MusicDisabled] });
        if (!message.member.voice.channel) return message.channel.send({ embeds: [NotInVC] });

        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
        }

        const embed = new discord.MessageEmbed()
            .setDescription(`Succesfully joined the voice chanel of ${message.author}!`)
            .setColor(colors.COLOR);
        message.channel.send({ embeds: [embed] });
    }
}
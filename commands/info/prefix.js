const discord = require('discord.js');
const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');

const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)
    
module.exports = {
    name: "prefix",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `prefix` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
         
        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) message.channel.send({ embeds: [errorMain]});
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
                    enableLevel: true
                });

                newGuild.save()
                    .catch(err => message.channel.send({ embeds: [errorMain]}));

                return message.channel.send({ embeds: [addedDatabase]});
            }
        });

        const embed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setDescription(`:thumbsup: This server's prefix is: **${settings.prefix}**`);
        message.channel.send({ embeds: [embed]});

    }
}
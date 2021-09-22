const discord = require('discord.js');
const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');

const optionsEmbed = new discord.MessageEmbed()
    .setTitle("Quabot configuration")
    .setColor(colors.COLOR)
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setDescription("Configure quabot to be perfect for your server. Select a category using the dropdown.")
const noPerms = new discord.MessageEmbed()
    .setTitle(":x: You do not have permission!")
    .setColor(colors.COLOR)

module.exports = {
    name: "config",
    aliases: ["settings"],
    async execute(client, message, args) {

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) message.channel.send(errorMain);
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
                    .catch(err => message.channel.send(errorMain));

                return message.channel.send(addedDatabase);
            }
        });
        const prefix = settings.prefix;

        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [noPerms] });

        const selectCategory = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('None selected.')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions([
                        {
                            label: 'Toggle Features',
                            description: 'Toggle certain settings like log channels, tickets, music and more.',
                            value: 'toggle_features',
                        },
                        {
                            label: 'Change Channels',
                            description: 'Allows you to change log channel, welcome channel and more channel-related settings.',
                            value: 'change_channels',
                        },
                        {
                            label: 'Change Prefix',
                            description: 'Allows you to change the QuaBot Prefix on this server..',
                            value: 'change_prefix',
                        },
                        {
                            label: 'Change Roles',
                            description: 'Allows you to change roles for people who are muted, on first join etc..',
                            value: 'change_roles',
                        },
                    ]),
            );
        message.reply({ ephemeral: true, embeds: [optionsEmbed], components: [selectCategory] });

                // LEVELS ENABLE
              function enableLevel() {
                   settings.updateOne({
                      enableLevel: "true"
                 }),
                // LEVELS DISABLE
                function disableLevel() {
                    settings.updateOne({
                        enableLevel: "false"
                    });
                }
        module.exports = {enableLevel, disableLevel}
        }
    }
}
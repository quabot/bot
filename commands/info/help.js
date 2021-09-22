const discord = require('discord.js');
const colors = require('../../files/colors.json');

const HelpMain = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Select a category of commands using the dropdown.")
    .setDescription("When selecting a category you'll get a detailed list of commands within that category.")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")

module.exports = {
    name: "help",
    aliases: ["commands", "command"],
    async execute(client, message, args) {

        console.log("Command `help` was used.");
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        const selectCategory = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('None selected.')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions([
                        {
                            label: 'Fun Commands',
                            description: 'These commands give funny pictures, games and more.',
                            value: 'fun_commands',
                        },
                        {
                            label: 'Info Commands',
                            description: 'These commands are used to get information about loads of different things.',
                            value: 'info_commands',
                        },
                        {
                            label: 'Music Commands',
                            description: 'These commands allow you to play music in your voice channel using youtube videos.',
                            value: 'music_commands',
                        },
                        {
                            label: 'Moderation Commands',
                            description: 'These commands are used to punish users and moderate the server.',
                            value: 'mod_commands',
                        },
                        {
                            label: 'Misc Commands',
                            description: 'These commands are just general commands that dont fit the descrition of the ones above.',
                            value: 'misc_commands',
                        },
                    ]),
            );
        message.channel.send({ embeds: [HelpMain], components: [selectCategory] });

    }
}
const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {

        if (!interaction.isSelectMenu()) return;

        const menu = client.menus.get(interaction.values[0]);

        if (!menu) return;
        if (menu.permission && !interaction.member.permissions.has(menu.permission))
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`⛔ You do not have permission to use that menu.\nYou need the permission: \`${menu.permission}\` to do that`)
                ], ephemeral: true
            }).catch(err => console.warn(err));

        // * Checks the bot's permissions.
        if (menu.permissions) {
            let error = false;
            menu.permissions.forEach(permission => {
                if (!interaction.guild.members.me.permissions.has(permission)) error = true;
                if (!interaction.guild.members.me.permissionsIn(interaction.channel).has(permission)) error = true;
            });

            if (error) {
                interaction.reply({
                    content:
                        `I need the permission(s): \`${menu.permissions.map(i => i)}\` to execute that command. Double check my permissions for the server and/or this channel.`
                    , ephemeral: true
                }).catch((err => { }));
                return;
            }

        }

        const channel = client.channels.cache.get("995300060881494138");
        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(
                        `**Menu:** ${interaction.customId}
                            **Guild:** ${interaction.guild.name}
                            **User:** ${interaction.user.tag}`)
                    .setTimestamp()
                    .setFooter({ text: "InteractionType SelectMenu" })
            ]
        });

        menu.execute(interaction, client, "#3a5a74").catch(err => {

            const channel = client.channels.cache.get("1000781833052639242");
            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setTitle("There was an error!")
                        .setDescription(`\`${err}\`
                        
                        **Menu:** ${interaction.customId}
                        **Guild:** ${interaction.guild.name}
                        **User:** ${interaction.user.tag}`)
                        .setTimestamp()
                        .setFooter({ text: "InteractionType SelectMenu" })
                ]
            });

        });
    }
}

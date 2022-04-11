const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: "help",
    description: "Bot commands.",
    async execute(client, interaction, color) {
        try {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`QuaBot Commands`)
                        .setDescription(`Select an item from the dropdown below this message to view the commands in that category.`)
                        .addField("Quick Links", "[Invite](https://invite.quabot.net) - [Discord](https://discord.quabot.net) - [Website](https://quabot.net)")
                        .setThumbnail(client.user.avatarURL({ dynamic: true }))
                        .setColor(color)
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId('select')
                                .setPlaceholder('Select a category')
                                .addOptions([
                                    {
                                        label: '😂 Fun Commands',
                                        description: 'This is a description',
                                        value: 'fun_commands',
                                    },
                                    {
                                        label: '📄 Info Commands',
                                        description: 'This is also a description',
                                        value: 'info_commands',
                                    },
                                    {
                                        label: '👍 Misc Commands',
                                        description: 'This is also a description',
                                        value: 'misc_commands',
                                    },
                                ]),
                        )
                ]
            }).catch(err => console.log(err));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
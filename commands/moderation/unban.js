const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "unban",
    description: "Unban a user.",
    permission: "BAN_MEMBERS",
    options: [
        {
            name: "user-id",
            description: "User-ID of the user to unban.",
            type: "STRING",
            required: true,
        },
    ],
    async execute(client, interaction, color) {
        try {

            let userid = interaction.options.getString('user-id');

            let member = await interaction.guild.bans.fetch(userid).catch(err => {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`That user doesn't exist/isn't banned!`)
                            .setColor(color)
                    ]
                }).catch(err => console.log(err));
                return;
            });

            interaction.guild.members.unban(userid).catch(err => {
                if (error.code !== 50035) {
                    console.log(err);
                }
            });

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`User Unbanned!`)
                        .setDescription(`**User:** <@${userid}>`)
                        .setColor(color)
                ]
            }).catch(err => console.log(err));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
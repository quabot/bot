const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain, invalidDiscrim } = require('../../files/embeds');

module.exports = {
    name: "discriminator",
    description: "Get all users with a specific discriminator.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "discriminator",
            description: "Tag you want to search for.",
            type: "STRING",
            required: true,
        }
    ],
    async execute(client, interaction) {

        try {
            const replyInv = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTimestamp()
                .setTitle(`:x: Invalid discriminator`)
            let discriminator = interaction.options.getString('discriminator');

            let matches = [];

           if (discriminator.length !== 4) return interaction.reply({ ephemeral: true, embeds: [replyInv] });
           if (isNaN(discriminator)) return interaction.reply({ ephemeral: true, embeds: [replyInv] })

            interaction.guild.members.cache.forEach(member => {
                if (member.user.discriminator === discriminator) {
                    matches.push("<@" + member.user + "> - " + member.user.username + "#" + member.user.discriminator);
                }
            })
            if (matches.length === 0) {
                const replyelse = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTimestamp()
                .setTitle(`:x: No-one with that discriminator!`)
                .setFooter(`${interaction.guild.memberCount} users scanned`)
                return interaction.reply({ ephemeral: true, embeds: [replyelse] });
            }
            const reply = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTimestamp()
                .setTitle(`All users with the discriminator #${discriminator}!`)
                .setDescription(`${matches.join("\n")}`)
                .setFooter(`${interaction.guild.memberCount} users scanned`)
            interaction.reply({ embeds: [reply] });

        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}
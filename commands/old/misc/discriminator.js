const { MessageEmbed } = require('discord.js');

const { error } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "discriminator",
    description: "Get all users with a specific discriminator.",
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
            const replyInv = new MessageEmbed()
                .setColor(COLOR_MAIN)
                
                .setTitle(`:x: Invalid discriminator`)
            let discriminator = interaction.options.getString('discriminator');

            let matches = [];

           if (discriminator.length !== 4) return interaction.reply({ ephemeral: true, embeds: [replyInv] }).catch(err => console.log(err));
           if (isNaN(discriminator)) return interaction.reply({ ephemeral: true, embeds: [replyInv] }).catch(err => console.log(err));

            interaction.guild.members.cache.forEach(member => {
                if (member.user.discriminator === discriminator) matches.push("<@" + member.user + "> - " + member.user.username + "#" + member.user.discriminator);
                
            });

            if (matches.length === 0) {
                const replyelse = new MessageEmbed()
                .setColor(COLOR_MAIN)
                
                .setTitle(`:x: No-one with that discriminator!`)
                .setFooter(`${interaction.guild.memberCount} users scanned`)
                return interaction.reply({ ephemeral: true, embeds: [replyelse] }).catch(err => console.log(err));
            }
            const reply = new MessageEmbed()
                .setColor(COLOR_MAIN)
                .setTitle(`All users with the discriminator #${discriminator}!`)
                .setDescription(`${matches.join("\n")}`)
                .setFooter(`${interaction.guild.memberCount} users scanned`)
            interaction.reply({ embeds: [reply] }).catch(err => console.log(err));

        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: bio`)] }).catch(err => console.log(err));
            return;
        }
    }
}
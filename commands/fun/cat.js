const { MessageEmbed } = require('discord.js');
const { meme } = require('memejs');

const { catScan, emptyReddit } = require('../../embeds/fun');
const { error } = require('../../embeds/general');

module.exports = {
    name: "cat",
    description: "Get a random cat image.",
    async execute(client, interaction) {
        try {
            interaction.reply({ embeds: [catScan] }).catch(err => console.log(err));
            meme('cats', function (err, data) {
                if (err) return interaction.editReply({ embeds: [error] }).catch(err => console.log(err));
                emptyReddit.setTitle(`${data.title}`).setImage(`${data.url}`).setFooter(`r/${data.subreddit}`);
                interaction.editReply({ embeds: [emptyReddit] }).catch(err => console.log(err));
            });
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: cat`)] }).catch(err => console.log(err));;
            return;
        }
    }
}
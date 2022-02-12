const { MessageEmbed } = require('discord.js');
const { meme } = require('memejs');

const { empty2, emptyReddit } = require('../../embeds/fun');
const { error } = require('../../embeds/general');

module.exports = {
    name: "reddit",
    description: "Get a meme from a subreddit.",
    options: [
        {
            name: 'subreddit',
            description: "A subreddit to get a meme from.",
            required: true,
            type: 'STRING',
        },
    ],
    async execute(client, interaction) {
        try {
            const reddit = interaction.options.getString('subreddit');
            empty2.setTitle(`🔍 Scanning r/${reddit} for memes!`)
            interaction.reply({ ephemeral: true, embeds: [empty2] }).catch(err => console.log("Error!"));
            meme(`${reddit}`, function (err, data) {
                error.setDescription("Could not find that subreddit.");
                if (err) return interaction.editReply({ embeds: [error] }).catch(err => console.log("Error!"));
                emptyReddit.setTitle(`${data.title}`).setImage(`${data.url}`).setFooter(`r/${data.subreddit}`);
                interaction.editReply({ embeds: [emptyReddit] }).catch(err => console.log("Error!"));
            });
        } catch (e) {
            interaction.channel.send({ ephemeral: true, embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: reddit`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}
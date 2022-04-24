const { MessageEmbed } = require('discord.js');
const { meme } = require('memejs');

module.exports = {
    name: "reddit",
    description: "description",
    options: [
        {
            name: "cat",
            description: "Get an image of a cat.",
            type: "SUB_COMMAND",
        },
        {
            name: "dog",
            description: "Get an image of a dog.",
            type: "SUB_COMMAND",
        },
        {
            name: "meme",
            description: "Get a meme from reddit.",
            type: "SUB_COMMAND",
        },

    ],
    async execute(client, interaction, color) {

        try {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription("Getting your image ready...")
                        .setColor(color)
                ]
            }).catch(err => console.log(err));

            const Sub = interaction.options.getSubcommand();
            switch (Sub) {
                case 'cat':
                    meme('cats', function (err, data) {
                        if (!data) return;
                        interaction.editReply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle(`${data.title}`)
                                    .setImage(`${data.url}`)
                                    .setFooter(`r/${data.subreddit}`)
                                    .setColor(color)
                            ]
                        }).catch(err => console.log(err));
                    });
                    break;

                case 'dog':
                    meme('dogpictures', function (err, data) {
                        if (!data) return;
                        interaction.editReply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle(`${data.title}`)
                                    .setImage(`${data.url}`)
                                    .setFooter(`r/${data.subreddit}`)
                                    .setColor(color)
                            ]
                        }).catch(err => console.log(err));
                    });
                    break;

                case 'meme':
                    meme('meme', function (err, data) {
                        if (!data) return;
                        interaction.editReply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle(`${data.title}`)
                                    .setImage(`${data.url}`)
                                    .setFooter(`r/${data.subreddit}`)
                                    .setColor(color)
                            ]
                        }).catch(err => console.log(err));
                    });
                    break;
            }

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
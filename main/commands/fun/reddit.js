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
                        .setDescription("<a:loading:647604616858566656>")
                        .setColor(color)
                ]
            }).catch(( err => { } ))

            // Send the message based on the subreddit.
            const Sub = interaction.options.getSubcommand();
            switch (Sub) {
                case 'cat':
                    // Generate the meme from the subreddit and send it in an embed.
                    meme('cats', function (err, data) {
                        if (!data) return;
                        interaction.editReply({
                            embeds: [
                                new MessageEmbed()
                                    .setImage(`${data.url}`)
                                    .setColor(color)
                            ]
                        }).catch(( err => { } ))
                    });
                    break;

                case 'dog':
                    meme('dogpictures', function (err, data) {
                        if (!data) return;
                        interaction.editReply({
                            embeds: [
                                new MessageEmbed()
                                    .setImage(`${data.url}`)
                                    .setColor(color)
                            ]
                        }).catch(( err => { } ))
                    });
                    break;

                case 'meme':
                    meme('meme', function (err, data) {
                        if (!data) return;
                        interaction.editReply({
                            embeds: [
                                new MessageEmbed()
                                    .setImage(`${data.url}`)
                                    .setColor(color)
                            ]
                        }).catch(( err => { } ))
                    });
                    break;
            }

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
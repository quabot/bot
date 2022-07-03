const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "dbtest",
    description: "dbtest",
    async execute(client, interaction, color) {

        const Demo = require('../../../structures/schemas/DemoSchema');
        const DemoDatabase = await Demo.findOne({
            guildId: interaction.guild.id,
        }, (err, demo) => {
            if (err) console.log(err);
            if (!demo) {
                const newDemo = new Demo({
                    guildId: interaction.guild.id,
                    stringItem: "String",
                    booleanItem: true,
                    numberItem: 69,
                });
                newDemo.save();
            }
        }).clone().catch((err => { }));

        if (!DemoDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("Database was just created! Please run that command again!")
            ], ephemeral: true
        }).catch((err => { }));

        interaction.reply(`${DemoDatabase.stringItem}\n${DemoDatabase.booleanItem}\n${DemoDatabase.numberItem}`);

        await DemoDatabase.updateOne({
            booleanItem: false,
            numberItem: Math.floor(Math.random() * 1000),
            stringItem: "ajgfbiusdgnh"
        });

    }
}
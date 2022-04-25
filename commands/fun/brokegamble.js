const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "brokegamble",
    description: 'Gamble, but without money.',
    options: [
        {
            name: "private",
            description: "Should QuaBot announce the result?",
            type: "BOOLEAN",
            required: false,
        }
    ],
    async execute(client, interaction, color) {
        try {
            let public = !interaction.options.getBoolean('private');

            let qbr = Math.floor(Math.random() * 10);
            let ur = Math.floor(Math.random() * 10);
            var result = 0;

            if (qbr === ur) { result = 0; }
            else if (qbr > ur) { result = 1; }
            else if (ur > qbr) { result = 2; }
            else { result = 3; }

            if (public) {
                if (result === 0) {return interaction.reply({embeds: [new MessageEmbed().setTitle('A drawer of gamblers').setDescription(`${interaction.user} gambled an *astounding*  $0 against me. We drew.\n\nQuaBot: ${qbr}\n${interaction.user}: ${ur}`).setColor(color)]});}
                else if (result === 1) {return interaction.reply({embeds: [new MessageEmbed().setTitle('Ha L').setDescription(`${interaction.user} gambled an *astounding*  $0 against me. They lost. What an idiot.\n\nQuaBot: ${qbr}\n${interaction.user}: ${ur}`).setColor(color)]});}
                else if (result === 2) {return interaction.reply({embeds: [new MessageEmbed().setTitle('F**k!').setDescription(`${interaction.user} gambled an *astounding*  $0 against me. They won. Huh.\n\nQuaBot: ${qbr}\n${interaction.user}: ${ur}`).setColor(color)]});}
                else if (result === 3) {return interaction.reply({embeds: [new MessageEmbed().setTitle('The f**k?').setDescription(`Something went wrong with my math? The f**k? ${interaction.user}`).setColor(color)]});}
                else { return interaction.reply({embeds: [new MessageEmbed().setTitle('Oh no.').setDescription(`Something went terribly wrong. Oh no. ${interaction.user}`).setColor(color)]}); }
            } else {
                if (result === 0) {return interaction.reply({embeds: [new MessageEmbed().setTitle('A drawer of gamblers').setDescription(`${interaction.user} gambled an *astounding*  $0 against me. We drew.\n\nQuaBot: ${qbr}\n${interaction.user}: ${ur}`).setColor(color)], ephemeral: true});}
                else if (result === 1) {return interaction.reply({embeds: [new MessageEmbed().setTitle('Ha L').setDescription(`${interaction.user} gambled an *astounding*  $0 against me. They lost. What an idiot.\n\nQuaBot: ${qbr}\n${interaction.user}: ${ur})`).setColor(color)], ephemeral: true});}
                else if (result === 2) {return interaction.reply({embeds: [new MessageEmbed().setTitle('F**k!').setDescription(`${interaction.user} gambled an *astounding*  $0 against me. They won. Huh.\n\nQuaBot: ${qbr}\n${interaction.user}: ${ur}`).setColor(color)], ephemeral: true});}
                else if (result === 3) {return interaction.reply({embeds: [new MessageEmbed().setTitle('The f**k?').setDescription(`Something went wrong with my math? The f**k? ${interaction.user}`).setColor(color)], ephemeral: true});}
                else { return interaction.reply({embeds: [new MessageEmbed().setTitle('Oh no.').setDescription(`Something went terribly wrong. Oh no. ${interaction.user}`).setColor(color)], ephemeral: true}); }
            }
        }
        catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "find-punishment",
    description: 'Find a punsihment of a user.',
    permission: "BAN_MEMBERS",
    options: [
        {
            name: "user",
            description: "The user you want to find a punishment for.",
            type: "USER",
            required: true,
        },
        {
            name: "punishement",
            description: "What punishment to use.",
            type: "STRING",
            required: true,
            values: [
                { name:"a", value: 'a'},
                { name:"b", value: 'a'},
            ]
        }
    ],
    async execute(client, interaction, color) {
        try {

            
        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}
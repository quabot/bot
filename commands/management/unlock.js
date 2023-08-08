const discord =  require('discord.js');
const colors = require('../files/colors.json');

module.exports = {
    name: "unlock",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `unlock` was used.");
        const useLock = new discord.MessageEmbed()  
            .setDescription("Please use `!lock unlock` to unlock a channel!")
            .setColor(colors.COLOR);
        message.channel.send(useLock);
    }
}
const config = require('../../files/config.json');
const discord = require('discord.js')

module.exports = (Discord, client, message) => {

    // STARTUP MESSAGE
    console.log(` \nGENERAL INFORMATION: \nClient: ${client.user.tag}\nChannels: ${client.channels.cache.size}\nServers: ${client.guilds.cache.size}\nUsers: ${client.users.cache.size}\nVersion: ${config.VERSION}\n `);
    setTimeout(() => {
        console.info(` \nYou are running Quabot, this project is made by do#8888. It is not allowed to distribute these files punblicly without the creator's consent.\n `)
    }, 5000);

    // STATUS
    client.user.setActivity(`${config.PREFIX}help`, { type: "PLAYING" });



};
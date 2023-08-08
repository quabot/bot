const discord = require('discord.js')

module.exports = (discord, client, message) => {

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
    
        if (interaction.commandName === 'ping') {
            await interaction.reply('Pong!');
        }
    });

};
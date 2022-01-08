const fs = require('fs');
const Discord = require('discord.js');
const consola = require('consola');

module.exports = (client, Discord) => {
    const commandFolders = fs.readdirSync('./commands/');

    for (const folder of commandFolders) {
        const command_files = fs.readdirSync(`./commands/economy`).filter(file => file.endsWith('.js'));
        for (const file of command_files) {
            const command = require(`../commands/economy/${file}`);
            client.commands.set(command.name, command);
            consola.info(`Loaded ${file}`)
        }
    }
}
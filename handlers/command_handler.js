const fs = require('fs');
const { Client, Intents } = require('discord.js');

module.exports = (client, Discord) => {
    const commandFolders = fs.readdirSync('./commands/');

    for (const folder of commandFolders) {
        const command_files = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of command_files) {
            const command = require(`../commands/${folder}/${file}`);
            client.commands.set(command.name, command);
            console.info(`Loaded ${file}`)
        }
        console.info(`Loaded all commands in category ${folder}`)
    }
}
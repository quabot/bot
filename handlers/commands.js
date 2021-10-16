const fs = require('fs');
const consola = require('consola');
const { commands } = require('..');

module.exports = (client, Discord) => {
    const commandFolders = fs.readdirSync('./commands/');

    for (const folder of commandFolders) {
        const command_files = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        const commandsArray = [];
        for (const file of command_files) {
            const command = require(`../commands/${folder}/${file}`);
            client.commands.set(command.name, command);
            commandsArray.push(command);

            client.on('ready', () => {
                client.guilds.cache.get("888800181213102130").commands.set(commandsArray);
            });
            consola.success(`Loaded ${file}`)
        }
        consola.info(`Loaded all commands in category ${folder}`);
    }
}
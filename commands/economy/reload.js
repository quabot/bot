const discord = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');
const fs = require('fs')

const { error, added } = require('../../embeds/general');
const shop = require('../../files/shop.json');

module.exports = {
    name: "reload",
    description: "reload a cmd",
    aliases: [],
    economy: true,
    async execute(client, message, args) {

        try {
            const commandName = args[0];
            const command = message.client.commands.get(commandName)
                || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (!command) {
                return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
            }

            const commandFolders = fs.readdirSync('./commands');
            const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));

            delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

            try {
                const newCommand = require(`../${folderName}/${command.name}.js`);
                message.client.commands.set(newCommand.name, newCommand);
                message.channel.send(`Command \`${command.name}\` was reloaded!`);
            } catch (error) {
                console.error(error);
                message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
}
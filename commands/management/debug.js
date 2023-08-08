const discord = require('discord.js');
const colors = require('../files/colors.json');
const config = require('../../files/config.json');
const fs = require('fs');

const validDebugs = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription("**Invalid debug**\nValid debugs are:\n`servers\nservers-console\nreload\nusername\nactivity\npresence`")

module.exports = {
    name: "debug",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `debug` was used.");

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send(noPermsMsg);

        if (message.author.id === "486563467810308096") {
            if (!args[0]) return message.channel.send(validDebugs)
            if (args[0] === "servers") {
                message.channel.send("**Quabot discord servers:**")
                client.guilds.cache.forEach(guild => {
                    message.channel.send(`${guild.name} | ${guild.id}`);
                    return
                });
            }
            if (args[0] === "servers-console") {
                console.log("QUABOT DISCORD SERVERS:")
                client.guilds.cache.forEach(guild => {
                    console.log(`${guild.name} | ${guild.id}`);
                    return
                })
            }
            if (args[0] === "reload") {
                const commandName = args[1];
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
            }
            if (args[0] === "username") {
                const newUsername = args[1];
                if (!newUsername) return message.channel.send("Please enter a 2nd argument")
                client.user.setUsername(newUsername);
                message.channel.send(`Changed username to: ${newUsername}`);
            }
            if (args[0] === "activity") {
                const newActivity = args[1];
                const newType = args[2];
                if (!newActivity) return message.channel.send("Please enter a 2nd argument")
                if(!newType) return message.channel.send("Please enter a 3rd argument")
                if(newType === "WATCHING" || newType === "STREAMING" || newType === "PLAYING") {
                    client.user.setActivity(newActivity, { type: newType });
                    message.channel.send(`Changed activity to: ${newActivity}`);
                } else {
                    message.channel.send("Enter either WATCHING, PLAYING, STREAMING");
                }
            }
            if (args[0] === "presence") {
                const newPresence = args[1];
                if(!newPresence) return message.channel.send("Please enter a 2rd argument")
                if(newPresence === "invisible" || newPresence === "online" || newPresence === "idle" || newPresence === "dnd") {
                    client.user.setStatus(newPresence);
                    message.channel.send(`Changed activity to: ${newPresence}`);
                } else {
                    message.channel.send("Enter either idle, dnd, online or invisible");
                }
            }
        } else {
            return;
        }
    }
}
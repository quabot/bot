const discord = require('discord.js');
const colors = require('../../files/colors.json');
const config = require('../../files/config.json');
const embed = require('../../files/embeds');
const fs = require('fs');

const validDebugs = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription("**Invalid debug**\nValid debugs are:\n`servers\nservers-console\nreload\nusername\nactivity\npresence`")

module.exports = {
    name: "debug",
    aliases: [],
    async execute(client, message, args) {
        message.delete()

        console.log("Command `debug` was used.");
        
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) return message.channel.send("I don't have permission to manage messages!");

        if (message.author.id === "486563467810308096") {
            if (!args[0]) return message.channel.send({ embeds: [validDebugs] })
            if (args[0] === "servers") {
                message.channel.send("**Quabot discord servers:**")
                client.guilds.cache.forEach(guild => {
                    message.channel.send(`${guild.name} | ${guild.id}`);
                    return
                });
            }
            if (args[0] === "servers-console") {
                console.log("Quabot discord servers:")
                client.guilds.cache.forEach(guild => {
                    console.log(`${guild.name} | ${guild.id}`);
                    return
                })
            }
            if (args[0] === "reload") {
                const commandName = args[1];
                const noCommandName = new discord.MessageEmbed()
                    .setTitle(":x: Please enter a command or alias to reload!")
                    .setColor(colors.COLOR)
                if (!commandName) return message.channel.send({ embeds: [noCommandName] })
                const command = message.client.commands.get(commandName)
                    || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

                if (!command) {
                    const noFoundCommand = new discord.MessageEmbed()
                        .setTitle(`:x: There is no command with name or alias \`${commandName}\`!`)
                        .setColor(colors.COLOR)
                    return message.channel.send({ embeds: [noFoundCommand] });
                }

                const commandFolders = fs.readdirSync('./commands');
                const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));

                delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

                try {
                    const newCommand = require(`../${folderName}/${command.name}.js`);
                    message.client.commands.set(newCommand.name, newCommand);
                    const succesReloaded = new discord.MessageEmbed()
                        .setTitle(`Command \`${command.name}\` was reloaded!`)
                        .setColor(colors.COLOR)
                    message.channel.send({ embeds: [succesReloaded] });
                } catch (error) {
                    console.error(error);
                    const reloadError = new discord.MessageEmbed()
                        .setTitle(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``)
                        .setColor(colors.COLOR)
                    message.channel.send({ embeds: [reloadError] });
                }
            }
            if (args[0] === "username") {
                const newUsername = args[1];
                const noargs = new discord.MessageEmbed()
                    .setTitle(`Please enter a new username for the bot!`)
                    .setColor(colors.COLOR)
                if (!newUsername) return message.channel.send({ embeds: [noargs] })
                client.user.setUsername(newUsername);
                const newName = new discord.MessageEmbed()
                    .setTitle(`Changed username to: ${newUsername}`)
                    .setColor(colors.COLOR)
                message.channel.send({ embeds: [newName] });
            }
            if (args[0] === "activity") {
                const newActivity = args[1];
                const newType = args[2];
                if (!newActivity) return message.channel.send("Please enter a 2nd argument")
                if (!newType) return message.channel.send("Please enter a 3rd argument")
                if (newType === "WATCHING" || newType === "STREAMING" || newType === "PLAYING") {
                    client.user.setActivity(newActivity, { type: newType });
                    message.channel.send(`Changed activity to: ${newActivity}`);
                } else {
                    message.channel.send("Enter either WATCHING, PLAYING, STREAMING");
                }
            }
            if (args[0] === "presence") {
                const newPresence = args[1];
                if (!newPresence) return message.channel.send("Please enter a 2rd argument")
                if (newPresence === "invisible" || newPresence === "online" || newPresence === "idle" || newPresence === "dnd") {
                    client.user.setStatus(newPresence);
                    message.channel.send(`Changed activity to: ${newPresence}`);
                } else {
                    message.channel.send("Enter either idle, dnd, online or invisible");
                }
            }
            if (args[0] === "destroy") {
                const shutdown = new discord.MessageEmbed()
                    .setTitle(":x: Quabot shutting down in 5 seconds...")
                    .setColor(colors.COLOR)
                message.channel.send({ embeds: [shutdown] });
                setTimeout(() => {
                    client.destroy();
                }, 5000);

            }
        } else {
            return;
        }
    }
}
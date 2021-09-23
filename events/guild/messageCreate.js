// MODULES
const Discord = require('discord.js');
const mongoose = require('mongoose');
const Levels = require('discord.js-leveling');

// FILES
const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const swearwords = require("../../files/data.json");
const colors = require('../../files/colors.json');

// ERROR MESSAGE

const errorMain = new Discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new Discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)
const errorEmbed = new Discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Something went wrong")
    .setDescription("There could be multiple reasons for this error.")
    .addField("Missing Permissions", "[Click here](https://github.com/QuaBot/QuaBot/wiki/Quabot-permissions) for the required permissions.", true)
    .addField("Bot maintenance", "[Click here](https://discord.gg/G9m7EAnbvq) to see Quabot status/maintenance.", true)
    .addField("Coding error", "[Click here](https://discord.gg/kNfy8MRF4n) to join the Quabot discord and report it.", true)
    .addField("Database error", "[Click here](https://discord.gg/2ryKmzTzFF) to make a support ticket.", true)
    .addField("Re-enter command", "Please re-enter your command to see if it works this time.", true)
    .addField("Other options", "This issue occured in the Quabot message.js event handler. Contact developers immediately.", true)
    .setFooter("Quabot errorEmbed")

module.exports = async (Discord, client, message) => {

    const thisGuildId = message.guild.id;

    // FAIL SAVE
    if (!message.guild) return;
    if (message.author.bot) return;

    // DATABASE
    const settings = await Guild.findOne({
        guildID: message.guild.id
    }, (err, guild) => {
        if (err) message.channel.send(errorMain);
        if (!guild) {
            const newGuild = new Guild({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                prefix: config.PREFIX,
                logChannelID: String,
                enableLog: false,
                enableSwearFilter: true,
                enableMusic: true,
                enableLevel: true,
            });

            newGuild.save()
                .catch(err => message.channel.send(errorMain));
            return message.channel.send({ embeds: [addedDatabase] }).then(m => m.delete({ timeout: 10000 }))
        }
    });

    // VARIABLES
    const IDGuild = message.guild.id;
    const user = message.author;
    const prefix = settings.prefix;
    const swearFilterOn = settings.enableSwearFilter;

    if (settings.enableLevel === "true") {

        const requiredXp = Levels.xpFor(parseInt(user.level) + 1)

        const randomAmountOfXp = Math.floor(Math.random() * 29) + 1;
        const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);

        if (hasLeveledUp) {

            const user = await Levels.fetch(message.author.id, message.guild.id);

            const levelEmbed = new Discord.MessageEmbed()
                .setTitle('New Level!')
                .setColor(colors.COLOR)
                .setDescription(`**GG** ${message.author}, you just leveled up to level **${user.level}**!\nContiune to chat to level up again.`)

            const sendEmbed = await message.channel.send({ embeds: [levelEmbed] });
        }
    }

    // EXECUTE COMMAND AND SWEARFILTER
    if (swearFilterOn === "true") {
        var msg = message.content.toLowerCase();
        for (let i = 0; i < swearwords["swearwords"].length; i++) {
            if (msg.includes(swearwords["swearwords"][i])) {
                message.delete();
                return message.channel.send("Please do not swear.").then(msg => msg.delete({ timeout: 3000 }));
            }
        }
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const cmd = args.shift().toLowerCase();

        const command = client.commands.get(cmd) ||
            client.commands.find(a => a.aliases && a.aliases.includes(cmd));;

        if (command) {
            command.execute(client, message, args, Discord);
            console.log(`Command "!${command.name}" was used.`);
        }

    } else {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const cmd = args.shift().toLowerCase();

        const command = client.commands.get(cmd) ||
            client.commands.find(a => a.aliases && a.aliases.includes(cmd));;

        if (command) {
            command.execute(client, message, args, Discord);
            console.log(`Command "!${command.name}" was used.`);
        }
    }
}
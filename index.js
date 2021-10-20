const { Client, Intents } = require('discord.js');
const Discord = require("discord.js");
const DisTube = require("distube")
const consola = require('consola')
const client = new Client({ intents: 32767 });
module.exports = client;
const Levels = require("discord.js-leveling");
const { GiveawaysManager } = require('discord-giveaways');
const mongoose = require("./utils/mongoose");
client.mongoose = require('./utils/mongoose');
const colors = require('./files/colors.json');
const { errorMain, addedDatabase, noWelcomeChannel } = require('./files/embeds');
const config = require('./files/config.json');
const Guild = require('./models/guild');
client.commands = new Discord.Collection();
['commands', 'events'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
});
consola.success('Loaded index.js!')
const prefix = "/";
client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./files/giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});

client.player = new DisTube.default(client);

client.on('message', (message) => {
    if (!message.content.startsWith("!")) return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift();
    if (command == "play")
        client.player.play(message, args.join(" "));
        message.reply("Now Playing: " + args.join(" "));
});

const { miscEmbed, funEmbed, infoEmbed, musicEmbed, moderationEmbed, managementEmbed } = require('./files/embeds');
const ModMain = new Discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Select Management or Moderation commands in the dropdown below.")
    .setDescription("When selecting a category you'll get a detailed list of commands within that category.")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
const selectMod = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Moderation Commands',
                    description: 'These commands are used to punish users and moderate the server.',
                    value: 'moder_commands',
                },
                {
                    label: 'Management Commands',
                    description: 'These commands are used by managers to clear channels, start giveaways and more.',
                    value: 'mang_commands',
                },
            ]),
    );
const noperms = new Discord.MessageEmbed()
    .setTitle(":x: You do not have permission!")
    .setColor(colors.COLOR)
client.on("interactionCreate", async (interaction) => {
    if (interaction.isSelectMenu()) {
        if (interaction.values[0] === "fun_commands") {
            interaction.reply({ ephemeral: true, embeds: [funEmbed] })
        }
        if (interaction.values[0] === "info_commands") {
            interaction.reply({ ephemeral: true, embeds: [infoEmbed] })
        }
        if (interaction.values[0] === "music_commands") {
            interaction.reply({ ephemeral: true, embeds: [musicEmbed] })
        }
        if (interaction.values[0] === "mod_commands") {
            interaction.reply({ ephemeral: true, embeds: [ModMain], components: [selectMod] });
        }
        if (interaction.values[0] === "moder_commands") {
            interaction.reply({ ephemeral: true, embeds: [moderationEmbed] });
        }
        if (interaction.values[0] === "mang_commands") {
            interaction.reply({ ephemeral: true, embeds: [managementEmbed] });
        }
        if (interaction.values[0] === "misc_commands") {
            interaction.reply({ ephemeral: true, embeds: [miscEmbed] })
        }
    }
});

Levels.setURL("mongodb+srv://admin:AbyUoKpaaWrjK@cluster.n4eqp.mongodb.net/Database?retryWrites=true&w=majority");
client.mongoose.init();
client.login(config.BOT_TOKEN);
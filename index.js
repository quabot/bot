const { Client, Collection } = require('discord.js');
const client = new Client({ intents: 14287, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
require('dotenv').config();

const { promisify } = require('util');
const { glob } = require("glob");
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');

client.buttons = new Collection();
client.commands = new Collection();
client.subcommands = new Collection();
['buttons', 'commands', 'events', 'subcommands'].forEach(handler => {
    require(`./structures/handlers/${handler}`)(client, PG, Ascii, consola);
});

client.login(process.env.TOKEN);



// ! Don't touch this! - Music System
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");

client.distube = new DisTube(client, {
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
    updateYouTubeDL: false,
});
module.exports = client;
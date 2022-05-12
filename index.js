const { Client, Collection, Message } = require('discord.js');
const client = new Client({ intents: 14287, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
require('dotenv').config();

const { promisify } = require('util');
const { glob } = require("glob");
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');

client.commands = new Collection();
client.buttons = new Collection();
client.menus = new Collection();
client.modals = new Collection();
['commands', 'buttons', 'events', 'menus', 'modals'].forEach(handler => {
    require(`./structures/handlers/${handler}`)(client, PG, Ascii, consola);
});

const discordModals = require('discord-modals');
discordModals(client);

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

client.login(process.env.TOKEN);
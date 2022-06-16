
/**
 * QuaBot's index.js file.
 * Made by Joa_sss.
 * 
 * Main things that happen in this file are variable declarations and the bot logging in.
 * It also creates the music client.
 */

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

const { AutoPoster } = require('topgg-autoposter')

const poster = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg0NTYwMzcwMjIxMDk1MzI0NiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjQxMzAwNTQxfQ.MhZPKVmJ2RgoWVZ1x5ADwZZI0oMt2Aa2Z_sjDC_QzXY', client)

poster.on('posted', (stats) => {
  console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
})

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
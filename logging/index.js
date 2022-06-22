
/**
 * QuaBot Logging Bot's index.js file
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

['events'].forEach(handler => {
  require(`./structures/handlers/${handler}`)(client, PG, Ascii, consola);
});

client.login(process.env.TOKEN);
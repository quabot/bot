const { glob } = require('glob');
const { promisify } = require('util');
const { Client } = require('discord.js');
const consola = require('consola');

const PG = promisify(glob);
let loaded = 0;

/**
 * @param {Client} client
 */
module.exports = async client => {
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/modals/*/*.js`);

  files.forEach(async file => {
    const modal = require(file);
    if (!modal.name) return;

    client.modals.set(modal.name, modal);
    loaded += 1;
  });

  consola.success(`Loaded ${loaded}/${files.length} modals.`);
};

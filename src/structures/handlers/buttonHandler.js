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
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/buttons/*/*.js`);

  files.forEach(async file => {
    const button = require(file);
    if (!button.name) return;

    client.buttons.set(button.name, button);
    loaded += 1;
  });

  consola.success(`Loaded ${loaded}/${files.length} buttons.`);
};

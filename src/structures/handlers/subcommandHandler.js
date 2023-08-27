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
  const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/subcommands/*/*/*.js`);
  files.forEach(async file => {
    const subcommand = require(file);
    if (!subcommand.parent || !subcommand.name) return;

    client.subcommands.set(`${subcommand.name}/${subcommand.parent}`, subcommand);

    loaded += 1;
  });

  consola.success(`Loaded ${loaded}/${files.length} subcommands.`);
};

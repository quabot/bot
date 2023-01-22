const { glob } = require('glob');
const { promisify } = require('util');
const { Client } = require('discord.js');
const consola = require('consola');

const PG = promisify(glob);
let loaded = 0;

/**
 * @param {Client} client 
 */
module.exports = async (client) => {
    const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/menus/*/*.js`);

    files.forEach(async file => {
        const menu = require(file);
        if (!menu.id) return;

        client.menus.set(menu.id, menu);
        loaded += 1;
    });


    consola.success(`Loaded ${loaded}/${files.length} select menus.`);
}
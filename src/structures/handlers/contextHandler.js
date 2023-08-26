const { glob } = require('glob');
const { promisify } = require('util');
const { Client } = require('discord.js');
const consola = require('consola');

const PG = promisify(glob);
let loaded = 0;

/**
 * @param {Client} client 
 */
const getContexts = async (client) => {
	const ContextList = [];

	const files = await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/context/*.js`);

	files.forEach(async file => {
		const menu = require(file);
		if (!menu.data) return;

		client.contexts.set(menu.data.name, menu);
		ContextList.push(menu.data);

		loaded += 1;
	});


	consola.success(`Loaded ${loaded}/${files.length} context menus.`);

	return ContextList;
};

module.exports = getContexts;
const consola = require('consola');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);

async function getContexts(client) {
    ContextList = [];

    (await PG(`${process.cwd().replace(/\\/g, '/')}/src/interactions/context/*.js`)).map(async contextFile => {
        const contextMenu = require(contextFile);

        client.contexts.set(contextMenu.data.name, contextMenu);
        ContextList.push(contextMenu.data);
    });

    consola.success(`Successfully loaded ${ContextList.length} context menus.`);

    return ContextList;
}

module.exports = { getContexts };

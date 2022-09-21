const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);

const consola = require('consola');
let loaded = 0;

module.exports = async (client) => {

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/interactions/modals/*.js`)).map(async (modalFile) => {
        const modal = require(modalFile);

        if (!modal.id) return success = false;

        client.modals.set(modal.id, modal);
        loaded += 1;
    });

    consola.success(`Successfully loaded ${loaded} modals.`);
}
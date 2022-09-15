const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');

let loaded = 0;
let total = 0;
let success = true;

module.exports = async (client) => {
    const ModalTable = new Ascii("Modals");

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/interactions/modals/*.js`)).map(async (modalFile) => {
        total+=1;

        const modal = require(modalFile);

        if (!modal.id) return success = false;

        client.modals.set(modal.id, modal);


        loaded+=1;

    });

    if (success) consola.success(`Successfully loaded ${loaded}/${total} modals.`);
    if (!success) consola.warn(`Failed to load all modals, loaded ${loaded}/${total} modals.`);
}
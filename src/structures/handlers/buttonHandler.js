const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');

let loaded = 0;
let total = 0;
let success = true;

module.exports = async (client) => {

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/interactions/buttons/*/*.js`)).map(async (buttonFile) => {
        total +=1;

        const button = require(buttonFile);

        if (!button.id) return success = false;

        client.buttons.set(button.id, button);

        loaded += 1;
    });

    if (success) consola.success(`Successfully loaded ${loaded}/${total} buttons.`);
    if (!success) consola.warn(`Failed to load all buttons, loaded ${loaded}/${total} buttons.`);

}
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);

const consola = require('consola');
let loaded = 0;

module.exports = async (client) => {

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/interactions/buttons/*/*.js`)).map(async (buttonFile) => {
        const button = require(buttonFile);
        if (!button.id) return success = false;
        client.buttons.set(button.id, button);
        loaded +=1;
    });

    consola.success(`Successfully loaded ${loaded} buttons.`);

}
const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');

let loaded = 0;
let total = 0;
let success = true;

module.exports = async (client) => {

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/events/*/*.js`)).map(async (eventFile) => {
        total +=1;

        const event = require(eventFile);
        if (event.once) { client.once(event.event, (...args) => event.execute(...args, client, "#3a5a74")); }
        else { client.on(event.event, (...args) => event.execute(...args, client, "#3a5a74")); }

        if (!event.name) return success = false;
        if (!event.event) return success = false;
        
        loaded +=1;
    });

    if (success) consola.success(`Successfully loaded ${loaded}/${total} events.`);
    if (!success) consola.warn(`Failed to load all events, loaded ${loaded}/${total} events.`);
}
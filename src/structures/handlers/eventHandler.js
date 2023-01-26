const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const consola = require('consola');

let loaded = 0;
let total = 0;

module.exports = async client => {
    (await PG(`${process.cwd().replace(/\\/g, '/')}/src/events/*/*.js`)).map(async eventFile => {
        total += 1;

        const event = require(eventFile);
        if (!event.name || !event.event) return;

        if (event.once) {
            client.once(event.event, (...args) => event.execute(...args, client, '#3a5a74').catch((e) => { }));
        } else {
                client.on(event.event, (...args) => event.execute(...args, client, '#3a5a74').catch((e) => console.log(e)));
        }

        loaded += 1;
    });

    consola.success(`Loaded ${loaded}/${total} events.`)
};

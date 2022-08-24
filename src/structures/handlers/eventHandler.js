const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');

module.exports = async (client) => {
    const EventsTable = new Ascii("Events");

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/events/*/*.js`)).map(async (eventFile) => {

        const event = require(eventFile);
        if (event.once) { client.once(event.event, (...args) => event.execute(...args, client, "#3a5a74")); }
        else { client.on(event.event, (...args) => event.execute(...args, client, "#3a5a74")); }

        if (!event.name) return await EventsTable.addRow(event.name, "❌ - FAILED, NO NAME");
        if (!event.event) return await EventsTable.addRow(event.event, "❌ - FAILED, NO EVENT");
        await EventsTable.addRow(event.name, "✅ - SUCCESS");
        
    });

    consola.log(EventsTable.toString());
}
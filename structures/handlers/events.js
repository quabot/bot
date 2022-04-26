const { color } = require('../../structures/settings.json');

module.exports = async (client, PG, Ascii, consola) => {
    const Table = new Ascii("Events");

    (await PG(`${process.cwd()}/events/*/*.js`)).map(async (file) => {
        const event = require(file);

        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args, client, color));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client, color));
        };

        await Table.addRow(event.name, "✅ SUCCES");
    });
    console.log(Table.toString());
}
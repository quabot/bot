module.exports = async (client, PG, Ascii, consola) => {
    const Table = new Ascii("Events");

    (await PG(`${process.cwd()}/events/*/*.js`)).map(async (file) => {
        const event = require(file);

        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        };

        await Table.addRow(event.name, "✅ SUCCESFULL");
    });
    consola.log(Table.toString());
}
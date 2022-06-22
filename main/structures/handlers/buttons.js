module.exports = async (client, PG, Ascii, consola) => {
    const Table = new Ascii("Buttons");
    const buttonsFolder = await PG(`${process.cwd()}/interactions/buttons/**/*.js`);

    buttonsFolder.map(async (file) => {
        const buttonFile = require(file);
        if (!buttonFile.id) return;

        client.buttons.set(buttonFile.id, buttonFile);
        Table.addRow(buttonFile.id, "✅ SUCCESS");
    });
    consola.log(Table.toString());
}
module.exports = async (client, PG, Ascii, consola) => {
    const Table = new Ascii("Modals");
    const modalsFolder = await PG(`${process.cwd()}/interactions/modals/**/*.js`);

    modalsFolder.map(async (file) => {
        const modalFile = require(file);
        if (!modalFile.id) return;

        client.modals.set(modalFile.id, modalFile);
        Table.addRow(modalFile.id, "✅ SUCCESS");
    });
    consola.log(Table.toString());
}
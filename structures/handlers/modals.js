module.exports = async (client, PG, Ascii, consola) => {
    const Table = new Ascii("Modals");
    const modalFolder = await PG(`${process.cwd().replace(/\\/g, "/")}/interactions/modals/**/*.js`);

    modalFolder.map(async (file) => {
        const modalFile = require(file);
        if (!modalFile.id) return;

        client.modals.set(modalFile.id, modalFile);
        Table.addRow(modalFile.id, "✅ - SUCCESS");
    });
    consola.log(Table.toString());
}
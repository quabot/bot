module.exports = async (client, PG, Ascii, consola) => {
    const Table = new Ascii("Menus");
    const menusFolder = await PG(`${process.cwd().replace(/\\/g, "/")}/interactions/menus/**/*.js`);

    menusFolder.map(async (file) => {
        const menuFile = require(file);
        if (!menuFile.value) return;

        client.menus.set(menuFile.value, menuFile);
        Table.addRow(menuFile.value, "✅ SUCCESS");
    });
    consola.log(Table.toString());
}
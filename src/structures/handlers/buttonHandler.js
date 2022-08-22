const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');

module.exports = async (client) => {
    const ButtonsTable = new Ascii("Buttons");

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/interactions/buttons/*/*.js`)).map(async (buttonFile) => {

        const button = require(buttonFile);

        if (!button.id) ButtonsTable.addRow(buttonFile.split("/")[7], "❌ - FAILED, NO ID");

        client.buttons.set(button.id, button);

        ButtonsTable.addRow(button.id, "✅ - SUCCESS");

    });

    consola.log(ButtonsTable.toString());
}
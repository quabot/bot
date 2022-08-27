const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');
const PG = promisify(glob);
const consola = require('consola');

module.exports = async (client) => {
    const ModalTable = new Ascii("Modals");

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/interactions/modals/*.js`)).map(async (modalFile) => {

        const modal = require(modalFile);

        if (!modal.id) ModalTable.addRow(modalFile.split("/")[7], "❌ - FAILED, NO ID");

        client.modals.set(modal.id, modal);

        ModalTable.addRow(modal.id, "✅ - SUCCESS");

    });

    consola.log(ModalTable.toString());
}
module.exports = async (client, PG, Ascii, consola) => {
    const Table = new Ascii("Commands");

    CommandsArray = [];

    (await PG(`${process.cwd().replace(/\\/g, "/")}/commands/**/main.js`)).map(async (file) => {
        const command = require(file);

        if (!command.name)
            return Table.addRow(file.split("/")[7], "❌FAILED", "Add a name.");

        if (!command.description)
            return Table.addRow(command.name, "❌FAILED", "Add a description.");

        client.commands.set(command.name, command)
        CommandsArray.push(command);

        await Table.addRow(command.name, "✅ SUCCESS");

    });

    consola.log(Table.toString());

    client.on('ready', async () => {
       client.application.commands.set(CommandsArray);
    });
};
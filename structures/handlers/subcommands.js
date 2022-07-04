module.exports = async (client, PG, Ascii, consola) => {
    const Table = new Ascii("Subcommands");

    CommandsArray = [];

    (await PG(`${process.cwd().replace(/\\/g, "/")}/commands/**/*.js`)).map(async (file) => {

        const commandFile = require(file);
        const subCommand = `${file.split("/")[8]}`.slice(0, -3);
        const command = file.split("/")[7];
        if (subCommand === "main") return;

        const sub = require(file);

        if (!sub.name)
            return Table.addRow(`${command}/${subCommand}`, "❌FAILED", "Add a name.");

        if (!sub.command)
            return Table.addRow(file.split("/")[7], "❌FAILED", "No base command.");

        client.subcommands.set(`${command}/${subCommand}`, commandFile)

        await Table.addRow(`${command}/${subCommand}`, "✅ SUCCESS");

    });

    consola.log(Table.toString());

};

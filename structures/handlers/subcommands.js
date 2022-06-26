module.exports = async (client, PG, Ascii, consola) => {
    const Table = new Ascii("Subcommands");

    CommandsArray = [];

    (await PG(`${process.cwd().replace(/\\/g, "/")}/commands/*/*/*.js`)).map(async (file) => {

        const commandFile = require(file);
        const subCommand = `${file.split("/")[9]}`.slice(0, -3);
        const command = file.split("/")[8];
        if (subCommand === "main") return;

        const sub = require(file);
        if (!sub.name)
           return Table.addRow(`${command}/${subCommand}`, "❌FAILED", "Add a name.");

        client.subcommands.set(`${command}/${subCommand}`, commandFile)

        await Table.addRow(`${command}/${subCommand}`, "✅ SUCCESS");

    });

    consola.log(Table.toString());

};

// combine commands & subcommands into 1 file
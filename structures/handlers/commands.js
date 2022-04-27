module.exports = async (client, PG, Ascii, consola) => {
    const Table = new Ascii("Commands");

    CommandsArray = [];

    (await PG(`${process.cwd()}/Commands/*/*.js`)).map(async (file) => {
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
        client.guilds.cache.forEach((guild) => {
            client.application.commands.set(CommandsArray).then(async (command) => {
                const Roles = (commandName) => {
                    const cmdPerms = CommandsArray.find((c) => c.name === commandName).permission;
                    if (!cmdPerms) return null;

                    return guild.roles.cache.filter((r) => r.permissions.has(cmdPerms))
                }

                const fullPermissions = command.reduce((accumulator, r) => {
                    const roles = Roles(r.name);
                    if (!roles) return accumulator;

                    const permissions = roles.reduce((a, r) => {
                        return [...a, { id: r.id, type: "ROLE", permission: true }]
                    }, [])

                    return [...accumulator, { id: r.id, permissions }]
                }, [])

                await guild.commands.permissions.set({ fullPermissions })
            }).catch(err => {
                console.error(err); //console.log(`⛔ Detected an issue with ${guild.name}!`);
            });
        });
    });

    client.on('guildCreate', async (guild) => {
        guild.commands.set(CommandsArray).then(async (command) => {
            const Roles = (commandName) => {
                const cmdPerms = CommandsArray.find((c) => c.name === commandName).permission;
                if (!cmdPerms) return null;

                return guild.roles.cache.filter((r) => r.permissions.has(cmdPerms))
            }

            const fullPermissions = command.reduce((accumulator, r) => {
                const roles = Roles(r.name);
                if (!roles) return accumulator;

                const permissions = roles.reduce((a, r) => {
                    return [...a, { id: r.id, type: "ROLE", permission: true }]
                }, [])

                return [...accumulator, { id: r.id, permissions }]
            }, [])

            await guild.commands.permissions.set({ fullPermissions })
        }).catch(err => {
            console.log(`Error with guild ${guild.name}! This is probably a lack of scopes.`);
        });
    });
};
const Responder = require('../../structures/schemas/Responder');

//* Activate custom commands.
//* This is a one-time event, so it's set to once: true.
module.exports = {
    event: "ready",
    name: "clientCommands",
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {

        //* This is used to properly listen to custom commands/responses.
        const commands = await Responder.find();
        commands.forEach(c => {
            if (!c.embed && !c.message && !c.reaction) return;
            client.custom_commands.push(c);
        });
    }
}
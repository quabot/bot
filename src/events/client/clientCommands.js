const Responder = require('../../structures/schemas/Responder');

module.exports = {
    event: "ready",
    name: "clientCommands",
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        const commands = await Responder.find();
        commands.forEach(c => {
            if (!c.embed && !c.message && !c.reaction) return;
            client.custom_commands.push(c);
        });
    }
}
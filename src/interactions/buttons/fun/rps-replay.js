module.exports = {
    id: "rps-replay",
    async execute(client, interaction, color) {
        const { execute } = require('../../../commands/commands/fun/rps');
        execute(client, interaction, color);
    }
}
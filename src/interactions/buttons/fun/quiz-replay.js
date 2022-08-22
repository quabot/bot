module.exports = {
    id: "quiz-replay",
    async execute(client, interaction, color) {
        const { execute } = require('../../../commands/commands/fun/quiz');
        execute(client, interaction, color);
    }
}
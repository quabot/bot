//* Reload the autoresponder reponses for the server.
module.exports = {
	code: 'responder-reload',
	async execute(client, data) {
		client.custom_commands = client.custom_commands.filter(c => c.guildId !== data.guildId);

		const Responder = require('../../structures/schemas/Responder');
		const responses = await Responder.find({ guildId: data.guildId });
		responses.forEach((response) => {
			client.custom_commands.push(response);
		});
	}
};
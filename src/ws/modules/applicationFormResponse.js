const { Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Embed } = require('../../utils/constants/embed');

//* Handle what happens when a form gets responded to.
module.exports = {
    code: 'responded-application-form',
    async execute(client, data) {

        //* Get the server and form data.
        const form = data.form;
        if (!form) return;

        const guild = client.guilds.cache.get(form.guildId);
        if (!guild) return;

        //* Check if the form exists and if anything should happen.
        const Application = require('../../structures/schemas/Application');
        const FoundForm = await Application.findOne({
          guildId: form.guildId,
          id: form.id
        });
        if (!FoundForm) return;
        if (!FoundForm.submissions_channel) return;

        //* Get the submission channel and send a message in it.
        const submission_channel = guild.channels.cache.get(FoundForm.submissions_channel);
        if (!submission_channel) return;
        let submission_user = guild.members.cache.get(form.userId);
        if (FoundForm.anonymous) submission_user = 'Anonymous';
        if (!submission_user) return;

        await submission_channel.send({
          embeds: [
            new Embed(Colors.Grey)
              .setTitle('New application form submitted!')
              .setDescription(`**${submission_user}** has submitted an answer to ${FoundForm.name}!`)
              .addFields(
                { name: 'Link', value: `[Click here](https://quabot.net/dashboard/${form.guildId}/modules/applications/responses/${form.response_uuid})`, inline: true },
              )
              .setFooter({ text: `${form.response_uuid}` })
          ], components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId(`application-accept`)
                  .setLabel('Accept')
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId(`application-deny`)
                  .setLabel('Deny')
                  .setStyle(ButtonStyle.Danger),
              ),
          ]
        });
    }
}
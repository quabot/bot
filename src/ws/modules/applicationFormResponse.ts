import { Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, type GuildMember } from 'discord.js';
import { Embed } from '@constants/embed';
import type { WsEventArgs } from '@typings/functionArgs';
import Application from '@schemas/ApplicationForm';
import { hasSendPerms } from '@functions/discord';

//* Handle what happens when a form gets responded to.
export default {
  code: 'responded-application-form',
  async execute({ client, data }: WsEventArgs) {
    //* Get the server and form data.
    const form = data.form;
    if (!form) return;

    const guild = client.guilds.cache.get(form.guildId);
    if (!guild) return;

    //* Check if the form exists and if anything should happen.
    const FoundForm = await Application.findOne({
      guildId: form.guildId,
      id: form.id,
    });
    if (!FoundForm) return;
    if (!FoundForm.submissions_channel) return;

    //* Get the submission channel and send a message in it.
    const submission_channel = guild.channels.cache.get(FoundForm.submissions_channel);
    if (!submission_channel?.isTextBased()) return;
    if (!hasSendPerms(submission_channel)) return;

    let submission_user: GuildMember | undefined | string = guild.members.cache.get(form.userId);
    if (FoundForm.anonymous) submission_user = 'Anonymous';
    if (!submission_user) return;

    await submission_channel.send({
      embeds: [
        new Embed(Colors.Grey)
          .setTitle('New application form submitted!')
          .setDescription(`**${submission_user}** has submitted an answer to ${FoundForm.name}!`)
          .addFields({
            name: 'Link',
            value: `[Click here](https://quabot.net/dashboard/${form.guildId}/modules/applications/responses/${form.response_uuid})`,
            inline: true,
          })
          .setFooter({ text: `${form.response_uuid}` }),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder().setCustomId('application-accept').setLabel('Accept').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId('application-deny').setLabel('Deny').setStyle(ButtonStyle.Danger),
        ),
      ],
    });
  },
};

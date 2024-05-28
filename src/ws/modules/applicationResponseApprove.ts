import { Embed } from '@constants/embed';
import type { WsEventArgs } from '@typings/functionArgs';
import Application from '@schemas/ApplicationForm';
import { hasRolePerms } from '@functions/discord';

//* Handle what happens when a form gets responded to.
export default {
  code: 'approved-application-form',
  async execute({ client, data }: WsEventArgs) {
    //* Get the data and the server.
    const form = data.form;
    if (!form) return;
    console.log('hi', data)

    const guild = client.guilds.cache.get(form.guildId);
    if (!guild) return;

    //* Get the form and the member.
    const FoundForm = await Application.findOne({
      guildId: form.guildId,
      id: form.id,
    });
    if (!FoundForm) return;

    const member = guild.members.cache.get(form.userId);
    if (!member) return;

    //* Give/remove the roles if needed.
    if (FoundForm.add_roles) {
      FoundForm.add_roles.forEach(async role => {
        const roleToAdd = guild.roles.cache.get(role);
        if (hasRolePerms(roleToAdd)) member.roles.add(roleToAdd!);
      });
    }

    if (FoundForm.remove_roles) {
      FoundForm.remove_roles.forEach(async role => {
        const roleToAdd = guild.roles.cache.get(role);
        if (hasRolePerms(roleToAdd)) member.roles.remove(roleToAdd!);
      });
    }
console.log('hi')
    await member
      .send({
        embeds: [
          new Embed('#416683').setDescription(
            `Your application response for the form **${FoundForm.name}** has been approved! Some roles may have been added/removed. You can view your answers [here](https://quabot.net/dashboard/${guild.id}/applications/answers/${data.response_uuid}).`,
          ),
        ],
      })
      .catch(() => {});
  },
};

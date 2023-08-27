const { Embed } = require("@constants/embed");

//* Handle what happens when a form gets responded to.
module.exports = {
  code: "approved-application-form",
  async execute(client, data) {
    //* Get the data and the server.
    const form = data.form;
    if (!form) return;

    const guild = client.guilds.cache.get(form.guildId);
    if (!guild) return;

    //* Get the form and the member.
    const Application = require("@schemas/Application");
    const FoundForm = await Application.findOne({
      guildId: form.guildId,
      id: form.id,
    });
    if (!FoundForm) return;

    const member = guild.members.cache.get(form.userId);
    if (!member) return;

    //* Give/remove the roles if needed.
    if (FoundForm.add_roles) {
      FoundForm.add_roles.forEach(async (role) => {
        const roleToAdd = guild.roles.cache.get(role);
        if (roleToAdd) member.roles.add(roleToAdd);
      });
    }

    if (FoundForm.remove_roles) {
      FoundForm.remove_roles.forEach(async (role) => {
        const roleToAdd = guild.roles.cache.get(role);
        if (roleToAdd) member.roles.remove(roleToAdd);
      });
    }

    await member
      .send({
        embeds: [
          new Embed("#416683").setDescription(
            `Your application response for the form **${FoundForm.name}** has been approved! Some roles may have been added/removed. You can view your answers [here](https://quabot.net/dashboard/${guild.id}/user/applications/answers/${data.responseId}).`,
          ),
        ],
      })
      .catch(() => {});
  },
};

const { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');
const { WebSocketServer } = require('ws');
const { Embed } = require('../../utils/constants/embed');
const consola = require('consola');
const { CustomEmbed } = require('../../utils/constants/customEmbed');

module.exports = {
  event: "ready",
  name: "clientSocket",
  once: true,
  /**
   * @param {Client} client 
   */
  async execute(client) {

    const wss = new WebSocketServer({ port: 8080 });
    consola.info('Listening on port :8080');

    wss.on('connection', function connection(ws) {
      ws.on('error', console.error);

      ws.on('message', async function message(d) {
        const data = JSON.parse(d);
        if (data.status !== 200) return;

        if (data.type === 'cache') client.cache.take(data.message);

        if (data.type === 'send-message') {
          const guild = client.guilds.cache.get(data.guildId);
          if (!guild) return;
          const channel = guild.channels.cache.get(data.channelId);
          const embed = data.embed;
          if (!channel) return;


          const getParsedString = (s) => {
            return `${s}`.replaceAll(`{guild}`, guild.name).replaceAll(`{members}`, guild.memberCount);
          }
          
          const sentEmbed = new CustomEmbed(data.message, getParsedString);
          if (embed) await channel.send({ embeds: [sentEmbed], content: getParsedString(data.message.content) ?? '' });
          if (!embed && (getParsedString(data.message.content) ?? '** **') !== '') await channel.send({ content: getParsedString(data.message.content) ?? '** **' });
        }

        if (data.type === 'send-message-ticket') {
          const guild = client.guilds.cache.get(data.guildId);
          if (!guild) return;
          const channel = guild.channels.cache.get(data.channelId);
          if (!channel) return;

          const embed = data.embedEnabled;


          const getParsedString = (s) => {
            return `${s}`.replaceAll(`{guild}`, guild.name).replaceAll(`{members}`, guild.memberCount).replaceAll('{color}', '#3a5a74');
          }
          const row = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('ticket-create')
                .setLabel('Create Ticket')
                .setStyle(ButtonStyle.Secondary)
            )

          if (!embed) return await channel.send({ content: getParsedString(data.message.content) ?? '', components: [row] });

          const sentEmbed = new CustomEmbed(data.message, getParsedString);

          await channel.send({ embeds: [sentEmbed], content: getParsedString(data.message.content) ?? '', components: [row] })
        }

        if (data.type === 'add-reaction') {
          const item = data.message;
          if (!item) return;

          const server = client.guilds.cache.get(item.guildId);
          if (!server) return;

          const channel = server.channels.cache.get(item.channelId);
          if (!channel) return;

          await channel.messages
            .fetch(item.messageId)
            .then(async (message) => {
              if (!message) return;
              await message.react(item.emoji);
            });
        }

        if (data.type === 'responded-application-form') {
          const data = JSON.parse(d);
          if (data.status !== 200) return;

          const form = data.form;
          if (!form) return;

          const guild = client.guilds.cache.get(form.guildId);
          if (!guild) return;

          const Application = require('../../structures/schemas/Application');
          const FoundForm = await Application.findOne({
            guildId: form.guildId,
            id: form.id
          });
          if (!FoundForm) return;
          if (!FoundForm.submissions_channel) return;

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
                  { name: 'Link', value: `[Click here](https://quabot.net/dashboard/${form.guildId}/modules/applications/answers/${form.response_uuid})` },
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

        if (data.type === 'approved-application-form') {
          const data = JSON.parse(d);
          if (data.status !== 200) return;

          const form = data.form;
          if (!form) return;

          const guild = client.guilds.cache.get(form.guildId);
          if (!guild) return;

          const Application = require('../../structures/schemas/Application');
          const FoundForm = await Application.findOne({
            guildId: form.guildId,
            id: form.id
          });
          if (!FoundForm) return;

          const member = guild.members.cache.get(form.userId);
          if (!member) return;

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
        }
      });
    });
  }
}
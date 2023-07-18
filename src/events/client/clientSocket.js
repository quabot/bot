const { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');
const { WebSocketServer } = require('ws');
const { Embed } = require('../../utils/constants/embed');
const consola = require('consola');
const { CustomEmbed } = require('../../utils/constants/customEmbed');
const Vote = require('../../structures/schemas/Vote');

module.exports = {
  event: "ready",
  name: "clientSocket",
  once: true,
  /**
   * @param {Client} client 
   */
  async execute(client) {

    const wss = new WebSocketServer({ port: 8081 });
    consola.info('Listening on port :8081');

    wss.on('connection', function connection(ws) {
      ws.on('error', console.error);

      ws.on('message', async function message(d) {
        const data = JSON.parse(d);
        if (data.status !== 200) return;

        if (data.type === 'cache') client.cache.take(data.message);

        if (data.type === 'vote') {
          if (data.body.type !== 'upvote') return;
          const guild = client.guilds.cache.get('1007810461347086357');
          if (!guild) return;
          const ch = guild.channels.cache.get('1024600377628299266');
          if (!ch) return;

          ch.send({
            content: `<@${data.body.user}>`,
            embeds: [
              new Embed('#416683')
                .setTitle('User Voted!')
                .setDescription(`<@${data.body.user}> has voted for QuaBot! Thank you for your support, you have received a 1.5x level multiplier. You can vote again in 12 hours! [Vote here.](https://top.gg/bot/995243562134409296/vote)`)
            ]
          });

          const user = client.users.cache.get(data.body.user);
          if (!user) return;

          user.send({
            embeds: [
              new Embed('#416683')
                .setDescription(`Hey ${user}! Thank you so much for voting for QuaBot. It really means a lot to us. As a reward, we have given you a 1.5x level multiplier for 12 hours! We hope you enjoy your time with QuaBot!`)
            ]
          })


          const config = await Vote.findOne(
            { userId: data.body.user },
            (err, config) => {
              if (err) console.log(err);
              if (!config)
                new Vote({
                  userId: data.body.user,
                  lastVote: `${new Date().getTime()}`
                }).save();
            }
          ).clone().catch(() => { });

          if (!config) return;
          config.lastVote = `${new Date().getTime()}`;
        }

        if (data.type === 'responder-reload') {
          client.custom_commands = client.custom_commands.filter(c => c.guildId !== data.guildId);
          
          const Responder = require('../../structures/schemas/Responder');
          const responses = await Responder.find({ guildId: data.guildId });
          responses.forEach((response) => {
            client.custom_commands.push(response);
          });
        }

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

        if (data.type === 'update-message') {
          const message = data.message;
          if (!message) return;

          const getParsedString = (s) => {
            return s;
          }

          const sentEmbed = new CustomEmbed(message, getParsedString);
          client.guilds.cache.forEach(async (guild) => {
            const Server = require('../../structures/schemas/Server');
            const config = await Server.findOne({ guildId: guild.id });
            if (config) {
              const channel = guild.channels.cache.get(config.updatesChannel);
              if (channel) {
                channel.send({ embeds: [sentEmbed] });
              }
            }

          })
        }

        if (data.type === 'send-message-ticket') {
          const guild = client.guilds.cache.get(data.guildId);
          if (!guild) return;
          const channel = guild.channels.cache.get(data.channelId);
          if (!channel) return;

          const embed = data.embedEnabled;


          const getParsedString = (s) => {
            return `${s}`.replaceAll(`{guild}`, guild.name).replaceAll(`{members}`, guild.memberCount).replaceAll('{color}', '#416683');
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
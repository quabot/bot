import { getVerificationConfig } from '@configs/verificationConfig';
import { Embed } from '@constants/embed';
import UserCaptcha from '@schemas/UserCaptcha';
import type { ButtonArgs } from '@typings/functionArgs';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import ms from 'ms';
const { CaptchaGenerator } = require('captcha-canvas');
import { randomUUID } from 'crypto';

export default {
  name: 'verification',

  async execute({ interaction, color, client }: ButtonArgs) {
    let guildId: any = interaction.guildId;
    if (!guildId) guildId = interaction.message.embeds[0] ? interaction.message.embeds[0].footer?.text : null;
    if (!guildId) return;
    const guild = client.guilds.cache.get(guildId) ?? (await client.guilds.fetch(guildId));

    const config = await getVerificationConfig(guildId ?? '', client);
    if (!config)
      return await interaction.reply({
        ephemeral: true,
        embeds: [new Embed(color).setDescription('The verification system is disabled.')],
      });

    let validRoles = true;
    config.roles.forEach(async (roleId: any) => {
      if (!guild?.roles.cache.get(roleId) && !(await guild?.roles.fetch(roleId))) validRoles = false;
    });
    config.removeRoles.forEach(async (roleId: any) => {
      if (!guild?.roles.cache.get(roleId) && !(await guild?.roles.fetch(roleId))) validRoles = false;
    });
    if (!validRoles)
      return await interaction.reply({
        ephemeral: true,
        embeds: [new Embed(color).setDescription('The roles are invalid.')],
      });

    const member = (interaction.member ?? (await guild?.members.fetch(interaction.user.id))) as GuildMember;
    if (!member)
      return await interaction.reply({
        ephemeral: true,
        embeds: [new Embed(color).setDescription("Couldn't find the member.")],
      });

    const sentFrom = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('sentFrom')
        .setLabel('Sent from server: ' + guild.name ?? 'Unknown')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );
    if (!interaction.guildId)
      return await interaction.update({
        components: [sentFrom],
      });

    //* CHeck if the user is already verified
    if (member.roles.cache.some(role => config.roles.includes(role.id)))
      return await interaction.reply({
        ephemeral: true,
        embeds: [new Embed(color).setDescription('You are already verified.')],
      });

    switch (config.type) {
      case 'button':
        config.roles.forEach(async (roleId: any) => {
          const role = guild?.roles.cache.get(roleId) ?? (await guild?.roles.fetch(roleId));
          if (!role) return;

          member.roles.add(role).catch(() => {});
        });
        config.removeRoles.forEach(async (roleId: any) => {
          const role = guild?.roles.cache.get(roleId) ?? (await guild?.roles.fetch(roleId));
          if (!role) return;

          member.roles.remove(role).catch(() => {});
        });

        await interaction.reply({
          ephemeral: true,
          embeds: [new Embed(color).setDescription('You have been verified.')],
        });
        break;

      case 'bot-captcha':
        let lastAttempt = 0;
        const capitalCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbersCharacters = '01234567890123456789';
        const symbolsCharacters = '!@#$%^&*!@#$%^&*';
        const characters = capitalCharacters + numbersCharacters + symbolsCharacters;

        const length = 6;
        let captchaText = '';
        for (let i = 0; i < length; i++) {
          captchaText += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        const captcha = new CaptchaGenerator({ height: 200, width: 600 })
          .setCaptcha({
            text: captchaText,
            size: 50,
            color: 'deeppink',
          })
          .setTrace({ color: 'deeppink' });
        const buffer = await captcha.generate();

        const submit = new ButtonBuilder()
          .setCustomId('bot-captcha')
          .setLabel('I am not a robot')
          .setStyle(ButtonStyle.Primary);

        const row: any = new ActionRowBuilder().addComponents(submit);

        const message = await interaction.reply({
          embeds: [
            new Embed(color)
              .setDescription('Please solve the captcha below. When you have an answer, click the button.')
              .setImage('attachment://captcha.png' as string),
          ],
          files: [{ name: 'captcha.png', attachment: buffer }],
          components: [row],
          ephemeral: true,
          fetchReply: true,
        });

        const collector = message.createMessageComponentCollector({
          filter: i => i.user.id === interaction.user.id,
          time: 180000,
        });

        collector.on('collect', async i => {
          if (i.customId !== 'bot-captcha') return;

          const allowedAt = lastAttempt + ms(config.cooldown);
          if (allowedAt > new Date().getTime()) {
            await i.reply({
              embeds: [
                new Embed(color).setDescription(
                  `Please wait ${(allowedAt - new Date().getTime()) / 1000} seconds before trying again.`,
                ),
              ],
              ephemeral: true,
            });
            return;
          }
          lastAttempt = new Date().getTime();

          const mainModal = new ModalBuilder()
            .setCustomId('bot-captcha-modal')
            .setTitle('Enter Captcha')
            .addComponents(
              new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                  .setCustomId('text')
                  .setLabel('Captcha Text')
                  .setStyle(TextInputStyle.Short)
                  .setValue('')
                  .setRequired(false)
                  .setMaxLength(2048)
                  .setPlaceholder('abcdef'),
              ),
            );

          await i.showModal(mainModal);

          const modal = await interaction
            .awaitModalSubmit({
              time: 180000,
              filter: i => i.user.id === interaction.user.id,
            })
            .catch(() => null);

          if (modal) {
            if (modal.customId !== 'bot-captcha-modal') return;

            await modal.deferReply({ ephemeral: true }).catch(() => {});
            const text = modal.fields.getTextInputValue('text');

            if (!text) return;

            if (text === captchaText) {
              collector.stop();

              config.roles.forEach(async (roleId: any) => {
                const role = guild?.roles.cache.get(roleId) ?? (await guild?.roles.fetch(roleId));
                if (!role) return;

                member.roles.add(role).catch(() => {});
              });
              config.removeRoles.forEach(async (roleId: any) => {
                const role = guild?.roles.cache.get(roleId) ?? (await guild?.roles.fetch(roleId));
                if (!role) return;

                member.roles.remove(role).catch(() => {});
              });

              await modal.editReply({
                embeds: [new Embed(color).setDescription('You have been verified.')],
              });
            } else {
              await modal.editReply({
                embeds: [new Embed(color).setDescription('The captcha text is incorrect. Please try again.')],
              });
            }
          }
        });

        collector.on('end', async () => {
          await interaction.editReply({
            components: [],
          });
        });

        break;

      case 'web-captcha':
        const previousCaptchas = await UserCaptcha.find({ userId: interaction.user.id, guildId: guildId });
        previousCaptchas.forEach(async captcha => {
          await captcha.deleteOne();
        });

        const id = randomUUID();
        const newCaptcha = new UserCaptcha({
          guildId: guildId,
          userId: interaction.user.id,
          id,
          date: new Date().getTime(),
          lastAttempt: 0,
        });
        await newCaptcha.save();

        await interaction.reply({
          embeds: [
            new Embed(color)
              .setTitle("You're almost there!")
              .setDescription(
                `Please complete the hCAPTCHA on our dashboard by clicking [here](https://quabot.net/dashboard/${guildId}/verification/verify?code=${id}). This link expires in 10 minutes.`,
              ),
          ],
          ephemeral: true,
        });
        break;
    }
  },
};

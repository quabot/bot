import type { EventArgs } from '@typings/functionArgs';
import type { ButtonInteraction, GuildChannel, GuildMember, TextChannel } from 'discord.js';
import { getAutomationConfig } from '@configs/automationConfig';
import Automation from '@schemas/Automation';
import { sendMessageAutomation } from '@functions/automations/actions/sendMessage';
import { IAutomation } from '@typings/schemas';
import { replyToMessageAutomation } from '@functions/automations/actions/replyToMessage';
import { sendDmAutomation } from '@functions/automations/actions/sendDm';
import { repostMessageAutomation } from '@functions/automations/actions/repostMessage';
import { reactToMessageAutomation } from '@functions/automations/actions/reactToMessage';
import { addRoleAutomation } from '@functions/automations/actions/addRole';
import { removeRoleAutomation } from '@functions/automations/actions/removeRole';
import { createThreadAutomation } from '@functions/automations/actions/createThread';
import { inChannelCheck } from '@functions/automations/if/inChannel';
import { isTypeCheck } from '@functions/automations/if/isType';
import { hasRoleCheck } from '@functions/automations/if/hasRole';
import { hasReactionCheck } from '@functions/automations/if/hasReaction';

export default {
  event: 'interactionCreate',
  name: 'automationButtonClick',
  async execute({ client }: EventArgs, interaction: ButtonInteraction) {
    if (interaction.user.bot) return;
    if (!interaction.guild) return;
    if (!interaction.guildId) return;
    if (!interaction.isButton()) return;

    const config = await getAutomationConfig(interaction.guildId, client);
    if (!config) return;
    if (!config.enabled) return;

    const automations = await Automation.find({
      guildId: interaction.guildId,
      trigger: 'click-button',
    });
    if (!automations) return;

    const buttonId = interaction.customId;
    const foundButton = config.buttons.find(button => button.id === buttonId);
    if (!foundButton) return;

    let shouldRun = true;
    for (const automation of automations) {
      if (automation.if) {
        for (const automationIf of automation.if) {
          if (
            automationIf.type === 'in-channel' &&
            !(await inChannelCheck({ guild: interaction.guild, channel: interaction.channel as GuildChannel }, client, automationIf))
          )
            shouldRun = false;
          if (automationIf.type === 'is-type' && !(await isTypeCheck(interaction.channel, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'has-role' && !(await hasRoleCheck(interaction.member as GuildMember, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'not-role' && (await hasRoleCheck(interaction.member as GuildMember, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'has-reactions' && !(await hasReactionCheck(interaction.message, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'click-button' && automationIf.buttonId !== buttonId) shouldRun = false;
        }
      }
    }

    if (!shouldRun) return;

    if (!interaction.channel) return;

    automations.forEach(async (automation: IAutomation) => {
      automation.action.map(async action => {
        if (action.type === 'send-message') await sendMessageAutomation(interaction.channel as TextChannel, client, action);
        if (action.type === 'reply') await replyToMessageAutomation(interaction, client, action);
        if (action.type === 'delete-message') await interaction.message.delete();
        if (action.type === 'pin') await interaction.message.pin();
        if (action.type === 'send-dm') sendDmAutomation(interaction.member as GuildMember, client, action);
        if (action.type === 'delete-channel') await interaction.channel!.delete();
        if (action.type === 'repost') await repostMessageAutomation(interaction.message, client, action);
        if (action.type === 'add-reaction') await reactToMessageAutomation(interaction.message, client, action);
        if (action.type === 'add-role') await addRoleAutomation(interaction.member as GuildMember, client, action);
        if (action.type === 'remove-role') await removeRoleAutomation(interaction.member as GuildMember, client, action);
        if (action.type === 'create-thread') await createThreadAutomation(interaction.message, client, action);
      });
    });
  },
};

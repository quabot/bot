import type { EventArgs } from '@typings/functionArgs';
import { Events, GuildChannel, type VoiceState } from 'discord.js';
import { getAutomationConfig } from '@configs/automationConfig';
import Automation from '@schemas/Automation';
import { sendMessageAutomation } from '@functions/automations/actions/sendMessage';
import { IAutomation } from '@typings/schemas';
import { sendDmAutomation } from '@functions/automations/actions/sendDm';
import { addRoleAutomation } from '@functions/automations/actions/addRole';
import { removeRoleAutomation } from '@functions/automations/actions/removeRole';
import { inChannelCheck } from '@functions/automations/if/inChannel';
import { isTypeCheck } from '@functions/automations/if/isType';
import { hasRoleCheck } from '@functions/automations/if/hasRole';

export default {
  event: Events.VoiceStateUpdate,
  name: 'automationJoinVc',
  async execute({ client }: EventArgs, oldState: VoiceState, newState: VoiceState) {
    if (!newState.guild.id) return;

    if (oldState.channelId && newState.channelId) return;
    if (!oldState.channelId) {
      const config = await getAutomationConfig(newState.guild.id, client);
      if (!config) return;
      if (!config.enabled) return;

      const automations = await Automation.find({
        guildId: newState.guild.id,
        trigger: 'join-vc',
      });
      if (!automations) return;

      let shouldRun = true;
      for (const automation of automations) {
        if (automation.if) {
          for (const automationIf of automation.if) {
            if (
              automationIf.type === 'in-channel' &&
              !(await inChannelCheck({ guild: newState.guild, channel: newState.channel as GuildChannel }, client, automationIf))
            )
              shouldRun = false;
            if (automationIf.type === 'is-type' && !(await isTypeCheck(newState.channel, client, automationIf)))
              shouldRun = false;
            if (automationIf.type === 'has-role' && !(await hasRoleCheck(newState.member, client, automationIf)))
              shouldRun = false;
            if (automationIf.type === 'not-role' && (await hasRoleCheck(newState.member, client, automationIf)))
              shouldRun = false;
          }
        }
      }

      if (!shouldRun) return;
      if (!newState.channel) return;

      automations.forEach(async (automation: IAutomation) => {
        automation.action.map(async action => {
          if (action.type === 'send-message')
            await sendMessageAutomation(newState.channel, client, action);
          if (action.type === 'send-dm') sendDmAutomation(newState.member, client, action);
          if (action.type === 'delete-channel') await newState.channel!.delete();
          if (action.type === 'add-role') await addRoleAutomation(newState.member, client, action);
          if (action.type === 'remove-role') await removeRoleAutomation(newState.member, client, action);
        });
      });
    }
  },
};

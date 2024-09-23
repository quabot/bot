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
import { hasOneRoleCheck } from '@functions/automations/if/hasOneRole';

export default {
  event: Events.VoiceStateUpdate,
  name: 'automationLeaveVc',
  async execute({ client }: EventArgs, oldState: VoiceState, newState: VoiceState) {
    if (!newState.guild.id) return;

    if (oldState.channelId && newState.channelId) return;
    if (!newState.channelId) {
      const config = await getAutomationConfig(newState.guild.id, client);
      if (!config) return;
      if (!config.enabled) return;

      const automations = await Automation.find({
        guildId: newState.guild.id,
        trigger: 'leave-vc',
        enabled: true
      });
      if (!automations) return;

      let shouldRun = true;
      for (const automation of automations) {
        if (automation.if) {
          for (const automationIf of automation.if) {
            if (
              automationIf.type === 'in-channel' &&
              !(await inChannelCheck({ guild: oldState.guild, channel: oldState.channel as GuildChannel }, client, automationIf))
            )
              shouldRun = false;
            if (automationIf.type === 'is-type' && !(await isTypeCheck(oldState.channel, client, automationIf)))
              shouldRun = false;
            if (automationIf.type === 'has-role' && !(await hasRoleCheck(oldState.member, client, automationIf)))
              shouldRun = false;
            if (automationIf.type === 'not-role' && (await hasOneRoleCheck(oldState.member, client, automationIf)))
              shouldRun = false;
          }
        }
      }

      if (!shouldRun) return;
      if (!oldState.channel) return;

      automations.forEach(async (automation: IAutomation) => {
        automation.action.map(async action => {
          if (action.type === 'send-message')
            await sendMessageAutomation(oldState.channel, client, action);
          if (action.type === 'send-dm') sendDmAutomation(oldState.member, client, action);
          if (action.type === 'delete-channel') await oldState.channel!.delete();
          if (action.type === 'add-role') await addRoleAutomation(oldState.member, client, action);
          if (action.type === 'remove-role') await removeRoleAutomation(oldState.member, client, action);
        });
      });
    }
  },
};

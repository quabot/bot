import type { EventArgs } from '@typings/functionArgs';
import type { GuildMember } from 'discord.js';
import { getAutomationConfig } from '@configs/automationConfig';
import Automation from '@schemas/Automation';
import { IAutomation } from '@typings/schemas';
import { hasRoleCheck } from '@functions/automations/if/hasRole';
import { sendDmAutomation } from '@functions/automations/actions/sendDm';
import { sendMessageAutomation } from '@functions/automations/actions/sendMessage';

export default {
  event: 'guildMemberRemove',
  name: 'automationLeaveServer',
  async execute({ client }: EventArgs, member: GuildMember) {
    if (!member.guild.id) return;

    const config = await getAutomationConfig(member.guild.id, client);
    if (!config) return;
    if (!config.enabled) return;

    const automations = await Automation.find({
      guildId: member.guild.id,
      trigger: 'leave-server',
    });
    if (!automations) return;

    let shouldRun = true;
    for (const automation of automations) {
      if (automation.if) {
        for (const automationIf of automation.if) {
          if (automationIf.type === 'has-role' && !(await hasRoleCheck(member, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'not-role' && (await hasRoleCheck(member, client, automationIf)))
            shouldRun = false;
        }
      }
    }

    if (!shouldRun) return;

    automations.forEach(async (automation: IAutomation) => {
      automation.action.map(async action => {
        if (action.type === 'send-message') await sendMessageAutomation(null, client, action);
        if (action.type === 'send-dm') sendDmAutomation(member, client, action);
      });
    });
  },
};

import type { EventArgs } from '@typings/functionArgs';
import type { Channel, GuildChannel, ThreadChannel } from 'discord.js';
import { getAutomationConfig } from '@configs/automationConfig';
import Automation from '@schemas/Automation';
import { inChannelCheck } from '@functions/automations/if/inChannel';
import { isTypeCheck } from '@functions/automations/if/isType';
import { hasRoleCheck } from '@functions/automations/if/hasRole';
import { sendMessageAutomation } from '@functions/automations/actions/sendMessage';
import { sendDmAutomation } from '@functions/automations/actions/sendDm';
import { addRoleAutomation } from '@functions/automations/actions/addRole';
import { IAutomation } from '@typings/schemas';
import { removeRoleAutomation } from '@functions/automations/actions/removeRole';
import { addToThreadAutomation } from '@functions/automations/actions/addToThread';
import { hasOneRoleCheck } from '@functions/automations/if/hasOneRole';

export default {
  event: 'threadCreate',
  name: 'automationThreadCreate',
  async execute({ client }: EventArgs, channel: ThreadChannel, newlyCreated: boolean) {
    if (!channel.guildId) return;
    if (!newlyCreated) return;

    const config = await getAutomationConfig(channel.guildId, client);
    if (!config) return;
    if (!config.enabled) return;

    const automations = await Automation.find({
      guildId: channel.guildId,
      trigger: 'create-thread',
      enabled: true
    });
    if (!automations) return;

    const parentChannel = channel.guild.channels.cache.get(channel.parentId ?? '') as GuildChannel;
    if (!parentChannel) return;
    
    const owner = await channel.guild.members.fetch(channel.ownerId ?? "");
    if (!owner) return;

    let shouldRun = true;
    for (const automation of automations) {
      if (automation.if) {
        for (const automationIf of automation.if) {
          if (
            automationIf.type === 'in-channel' &&
            !(await inChannelCheck({ guild: channel.guild, channel: parentChannel }, client, automationIf))
          )
            shouldRun = false;
          if (automationIf.type === 'is-type' && !(await isTypeCheck((parentChannel as Channel), client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'has-role' && !(await hasRoleCheck(owner, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'not-role' && (await hasOneRoleCheck(owner, client, automationIf)))
            shouldRun = false;
        }
      }
    }

    if (!shouldRun) return;

    automations.forEach(async (automation: IAutomation) => {
      automation.action.map(async action => {
        if (action.type === 'send-message') await sendMessageAutomation(channel, client, action);
        if (action.type === 'send-dm') sendDmAutomation(owner, client, action);
        if (action.type === 'delete-channel') await channel.delete();
        if (action.type === 'add-role') await addRoleAutomation(owner, client, action);
        if (action.type === 'remove-role') await removeRoleAutomation(owner, client, action);
        if (action.type === 'add-users-to-thread') await addToThreadAutomation(channel, client, action);
      });
    });
  },
};

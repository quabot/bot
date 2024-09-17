import type { EventArgs } from '@typings/functionArgs';
import type { Channel, GuildChannel } from 'discord.js';
import { getAutomationConfig } from '@configs/automationConfig';
import Automation from '@schemas/Automation';
import { inChannelCheck } from '@functions/automations/if/inChannel';
import { isTypeCheck } from '@functions/automations/if/isType';
import { sendMessageAutomation } from '@functions/automations/actions/sendMessage';
import { IAutomation } from '@typings/schemas';

export default {
  event: 'channelCreate',
  name: 'automationThreadCreate',
  async execute({ client }: EventArgs, channel: GuildChannel) {
    if (!channel.guildId) return;

    const config = await getAutomationConfig(channel.guildId, client);
    if (!config) return;
    if (!config.enabled) return;

    const automations = await Automation.find({
      guildId: channel.guildId,
      trigger: 'create-channel',
      enabled: true
    });
    if (!automations) return;

    const parentChannel = channel.guild.channels.cache.get(channel.parentId ?? '') as GuildChannel;
    if (!parentChannel) return;
  

    let shouldRun = true;
    for (const automation of automations) {
      if (automation.if) {
        for (const automationIf of automation.if) {
          if (
            automationIf.type === 'in-channel' &&
            !(await inChannelCheck({ guild: channel.guild, channel: parentChannel }, client, automationIf))
          )
            shouldRun = false;
          if (automationIf.type === 'is-type' && !(await isTypeCheck((channel as Channel), client, automationIf)))
            shouldRun = false;
        }
      }
    }

    if (!shouldRun) return;

    automations.forEach(async (automation: IAutomation) => {
      automation.action.map(async action => {
        if (action.type === 'send-message') await sendMessageAutomation(channel, client, action);
        if (action.type === 'delete-channel') await channel.delete();
      });
    });
  },
};

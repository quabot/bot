import type { EventArgs } from '@typings/functionArgs';
import type { ThreadChannel } from 'discord.js';
import { getAutomationConfig } from '@configs/automationConfig';
import Automation from '@schemas/Automation';

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
    });
    if (!automations) return;
console.log(channel)
    let shouldRun = true;
    if (!shouldRun) return;
  },
};

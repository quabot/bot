import type { EventArgs } from '@typings/functionArgs';
import type { Message, TextChannel } from 'discord.js';
import { getAutomationConfig } from '@configs/automationConfig';
import Automation from '@schemas/Automation';
import { sendMessageAutomation } from '@functions/automations/sendMessage';
import { IAutomation } from '@typings/schemas';
import { replyToMessageAutomation } from '@functions/automations/replyToMessage';
import { sendDmAutomation } from '@functions/automations/sendDm';
import { repostMessageAutomation } from '@functions/automations/repostMessage';
import { reactToMessageAutomation } from '@functions/automations/reactToMessage';
import { addRoleAutomation } from '@functions/automations/addRole';
import { removeRoleAutomation } from '@functions/automations/removeRole';
import { createThreadAutomation } from '@functions/automations/createThread';
import { giveXPAutomation } from '@functions/automations/giveXP';
import { removeXPAutomation } from '@functions/automations/removeXP';

export default {
  event: 'messageCreate',
  name: 'automationSentMessage',
  async execute({ client }: EventArgs, message: Message) {
    if (message.author.bot) return;
    if (!message.guildId) return;

    const config = await getAutomationConfig(message.guildId, client);
    if (!config) return;
    if (!config.enabled) return;

    const automations = await Automation.find({
      guildId: message.guildId,
      trigger: 'sent-message',
    });
    if (!automations) return;

    //* Check for each of the ifs
    //This event can used to trigger:
    // warn/ban/timeout/kick user

    automations.forEach(async (automation: IAutomation) => {
			automation.action.map(async (action) => {
				if (action.type === 'send-message') await sendMessageAutomation(message.channel as TextChannel, client, action);
				if (action.type === 'reply') await replyToMessageAutomation(message, client, action);
        if (action.type === 'delete-message') await message.delete();
        if (action.type === 'pin') await message.pin();
        if (action.type === 'send-dm') sendDmAutomation(message.member, client, action);
        if (action.type === 'delete-channel') await message.channel.delete();
        if (action.type === 'repost') await repostMessageAutomation(message, client, action);
        if (action.type === 'add-reaction') await reactToMessageAutomation(message, client, action);
        if (action.type === 'add-role') await addRoleAutomation(message.member, client, action);
        if (action.type === 'remove-role') await removeRoleAutomation(message.member, client, action);
        if (action.type === 'create-thread') await createThreadAutomation(message, client, action);
        if (action.type === 'give-xp') await giveXPAutomation(message, client, action);
        if (action.type === 'take-xp') await removeXPAutomation(message, client, action);
			});
    });
  },
};

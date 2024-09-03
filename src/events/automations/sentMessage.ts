import type { EventArgs } from '@typings/functionArgs';
import type { Message, TextChannel } from 'discord.js';
import { getAutomationConfig } from '@configs/automationConfig';
import Automation from '@schemas/Automation';
import { sendMessageAutomation } from '@functions/automations/sendMessage';
import { IAutomation } from '@typings/schemas';
import { replyToMessageAutomation } from '@functions/automations/replyToMessage';

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
		// Create a thread from message, with message in thread
    // repost the message to another channel
    // pin the message
    // delete the message
    // react to the message with these emojis
    // give the user this role
    // remove this role from the user
    // give xp to the user
    // remove xp from the user
    // warn/ban/timeout/kick user

    automations.forEach(async (automation: IAutomation) => {
			automation.action.map(async (action) => {
				if (action.type === 'send-message') await sendMessageAutomation(message.channel as TextChannel, client, action);
				if (action.type === 'reply') await replyToMessageAutomation(message, client, action);
			});
    });
  },
};

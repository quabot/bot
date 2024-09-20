import { Events, GuildMember } from 'discord.js';
import type { EventArgs } from '@typings/functionArgs';
import { getAutomationConfig } from '@configs/automationConfig';
import Automation from '@schemas/Automation';
import { hasRoleCheck } from '@functions/automations/if/hasRole';
import { gainedRoleCheck } from '@functions/automations/if/gainedRole';
import { sendDmAutomation } from '@functions/automations/actions/sendDm';
import { addRoleAutomation } from '@functions/automations/actions/addRole';
import { removeRoleAutomation } from '@functions/automations/actions/removeRole';
import { IAutomation } from '@typings/schemas';

export default {
  event: Events.GuildMemberUpdate,
  name: 'roleRemoveAutomations',
  async execute({ client }: EventArgs, oldMember: GuildMember, newMember: GuildMember) {
    if (!newMember.guild.id) return;

    if (oldMember.nickname !== newMember.nickname) return;
    if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) return;
    if (oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) return;
    if (oldMember.avatar !== newMember.avatar) return;
    const roleRemoved = oldMember.roles.cache.size > newMember.roles.cache.size;

    let role:any;
    if (oldMember.roles.cache.size < newMember.roles.cache.size)
      role = newMember.roles.cache
        .filter(n => !oldMember.roles.cache.has(n.id))
        .map(r => r.toString())
        .join('');
    if (roleRemoved)
      role = oldMember.roles.cache
        .filter(n => !newMember.roles.cache.has(n.id))
        .map(r => r.toString())
        .join('');

    if (!role) return;

    const config = await getAutomationConfig(newMember.guild.id, client);
    if (!config) return;
    if (!config.enabled) return;

    const fetchedRole = newMember.guild.roles.cache.find(r => r.toString() === role);
    if (!fetchedRole) return;

    if (roleRemoved) return;

    const automations = await Automation.find({
      guildId: newMember.guild.id,
      trigger: 'role-removed',
      enabled: true
    });
    if (!automations) return;

    let shouldRun = true;
    for (const automation of automations) {
      if (automation.if) {
        for (const automationIf of automation.if) {
          if (automationIf.type === 'has-role' && !(await hasRoleCheck(newMember, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'not-role' && (await hasRoleCheck(newMember, client, automationIf)))
            shouldRun = false;
          if (automationIf.type === 'gained-role' && !(await gainedRoleCheck(fetchedRole, client, automationIf)))
            shouldRun = false;
          if (automationIf.type !== 'lost-role' && !(await gainedRoleCheck(fetchedRole, client, automationIf)))
            shouldRun = false;
        }
      }
    }

    if (!shouldRun) return;

    automations.forEach(async (automation: IAutomation) => {
      automation.action.map(async action => {
        if (action.type === 'send-dm') sendDmAutomation(newMember, client, action);
        if (action.type === 'add-role') await addRoleAutomation(newMember, client, action);
        if (action.type === 'remove-role') await removeRoleAutomation(newMember, client, action);
      });
    });
  },
};

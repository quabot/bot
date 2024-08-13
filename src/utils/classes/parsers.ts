import { isSnowflake } from '@functions/string';
import type { GuildChannel } from '@typings/discord';
import type { ISuggestion } from '@typings/schemas';
import type {
  ButtonInteraction,
  ColorResolvable,
  Guild,
  GuildMember,
  Interaction,
  Message,
  MessageReaction,
  PartialMessage,
  Role,
  Snowflake,
  ThreadChannel,
} from 'discord.js';

export interface BaseParser {
  variables: ParserVariable[];
  functionalVariables: FunctionalParserVariable[];
}
export class BaseParser {
  constructor() {
    this.variables = [];
    this.functionalVariables = [];
  }

  parse(text: string) {
    let res = text;

    for (const variable of this.variables) {
      res = (res ?? '').replaceAll(`{${variable.name}}`, variable.value);

      variable.aliases?.forEach(a => (res = (res ?? '').replaceAll(`{${a}}`, variable.value)));
    }

    for (const variable of this.functionalVariables) {
      const searchFor = `{${variable.startsWith}`;

      let arr = res.split(searchFor);
      if (res.startsWith(searchFor)) {
        arr[0] = parseFunctionalVariable(arr[0], variable);
      }
      arr = [arr[0]].concat(arr.slice(1).map(v => parseFunctionalVariable(v, variable)));

      res = arr.join('');
    }

    return res;
  }

  changeVariables(...variableChanges: { name: string; newValue: string }[]) {
    for (const variableChange of variableChanges) {
      const i = this.variables.indexOf(this.variables.filter(({ name }) => name === variableChange.name)[0]);
      this.variables[i] = {
        name: variableChange.name,
        value: variableChange.newValue,
        aliases: this.variables[i].aliases,
      };
    }

    return this;
  }

  addVariables(...variables: ParserVariable[]) {
    this.variables.push(...variables);

    return this;
  }

  removeVariables(...variableNames: string[]) {
    this.variables = this.variables.filter(({ name }) => variableNames.includes(name));

    return this;
  }

  changeFunctionalVariables(
    ...functionalVariableChanges: { startsWith: string; newValue: (variable: string) => string }[]
  ) {
    for (const variableChange of functionalVariableChanges) {
      const i = this.functionalVariables.indexOf(
        this.functionalVariables.filter(({ startsWith }) => startsWith === variableChange.startsWith)[0],
      );
      this.functionalVariables[i] = {
        startsWith: variableChange.startsWith,
        value: variableChange.newValue,
      };
    }

    return this;
  }

  addFunctionalVariables(...variables: FunctionalParserVariable[]) {
    this.functionalVariables.push(...variables);

    return this;
  }

  removeFunctionalVariables(...variableStartsWiths: string[]) {
    this.functionalVariables = this.functionalVariables.filter(({ startsWith }) =>
      variableStartsWiths.includes(startsWith),
    );

    return this;
  }
}

export class GuildParser extends BaseParser {
  constructor(guild: Guild) {
    super();

    this.addVariables(
      { name: 'server.name', aliases: ['server'], value: guild.name },
      { name: 'server.id', value: guild.id },
      { name: 'server.members', value: guild.memberCount.toString() },
      { name: 'server.channels', value: guild.channels.cache.size.toString() },
      { name: 'server.owner', value: guild.members.cache.get(guild.ownerId)?.toString() ?? '' },
      { name: 'server.owner_id', value: guild.ownerId },
      { name: 'server.icon', value: guild.icon ?? '' },
      { name: 'server.iconUrl', value: guild.iconURL() ?? '' },
    );

    this.addFunctionalVariables(
      {
        startsWith: '#',
        value: v => {
          if (isSnowflake(v)) {
            return guild.channels.cache.get(v)?.toString() ?? '';
          } else {
            return guild.channels.cache.find(c => c.name === v)?.toString() ?? '';
          }
        },
      },
      {
        startsWith: '@',
        value: v => {
          if (isSnowflake(v)) {
            return guild.members.cache.get(v)?.toString() ?? '';
          } else {
            return `{@${v}}`;
          }
        },
      },
      {
        startsWith: '@&',
        value: v => {
          return guild.roles.cache.get(v)?.toString() ?? '';
        },
      },
    );
  }
}

export class MemberParser extends GuildParser {
  constructor({ member, color }: MemberParserArgs) {
    super(member.guild);

    this.addVariables(
      { name: 'user.username', value: member.user.username },
      { name: 'username', value: member.user.username },
      { name: 'user.displayname', aliases: ['user.display_name'], value: member.displayName },
      { name: 'user.avatar', value: member.avatar ?? member.user.avatar ?? '' },
      { name: 'user.avatarUrl', value: member.displayAvatarURL() },
      { name: 'avatar', value: member.displayAvatarURL() },
      { name: 'user.id', value: member.id },
      { name: 'user.createdAt', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>` },
      {
        name: 'user.globalname',
        aliases: ['user.global_name'],
        value: member.user.globalName ?? member.user.displayName ?? '',
      },
      { name: 'user', value: member.toString() },
      { name: 'color', value: color.toString() },
    );
    if (member.joinedTimestamp)
      this.addVariables({ name: 'user.joinDate', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` });
  }
}

export class CardParser extends MemberParser {
  constructor({ member, color }: MemberParserArgs) {
    super({ member, color });

    const { createdAt } = member.user;
    const { joinedAt } = member;

    this.changeVariables(
      {
        name: 'server.owner',
        newValue: member.guild.members.cache.get(member.guild.ownerId)?.displayName ?? '',
      },
      {
        name: 'user.createdAt',
        newValue: `${createdAt.getDate()} ${
          [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ][createdAt.getMonth()]
        } ${createdAt.getFullYear()}`,
      },
    );
    if (joinedAt)
      this.changeVariables({
        name: 'user.joinDate',
        newValue: `${joinedAt.getDate()} ${
          [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ][joinedAt.getMonth()]
        } ${joinedAt.getFullYear()}`,
      });
  }
}

export class ReactionRoleParser extends MemberParser {
  constructor({ action, role, member, color, reaction }: ReactionRoleParserArgs) {
    super({ member, color });

    this.addVariables(
      { name: 'action', value: action },
      { name: 'role', value: role.name },
      { name: 'message', value: reaction.message.url },
    );
  }
}
export class BoostParser extends MemberParser {
  constructor({ member, color, guild }: BoostParserArgs) {
    super({ member, color });

    this.addVariables(
      { name: 'boosts', value: guild.premiumSubscriptionCount ? guild.premiumSubscriptionCount.toString() : '0' },
      { name: 'tier', value: guild.premiumTier.toString() },
    );
  }
}

export class LevelParser extends MemberParser {
  constructor({ channel, level, xp, member, color }: LevelParserArgs) {
    super({ member, color });

    const formula = (lvl: number) => 120 * lvl ** 2 + 100;

    this.addVariables(
      { name: 'channel', value: channel.toString() },
      { name: 'channel.name', value: channel.name },
      { name: 'channel.id', value: channel.id },
      { name: 'level', value: level.toString() },
      { name: 'xp', value: xp.toString() },
      { name: 'required_xp', value: formula(level).toString() },
    );
  }
}

export class StarMessagesParser extends MemberParser {
  constructor({ channel, emoji, member, color, count, message }: StarMessageArgs) {
    super({ member, color });

    this.addVariables(
      { name: 'channel', value: `<#${channel.id}>` },
      { name: 'channel.name', value: channel.name },
      { name: 'channel.id', value: channel.id },
      { name: 'emoji', value: emoji },
      { name: 'stars', value: `${count}` },
      { name: 'message.content', value: message.content ?? '' },
      { name: 'message.id', value: message.id },
      { name: 'message.url', value: message.url },
    );
  }
}

export class RewardLevelParser extends LevelParser {
  constructor(data: RewardLevelParserArgs) {
    super(data);

    this.addVariables(
      { name: 'role', aliases: ['reward', 'reward.role'], value: `<@&${data.reward.role}>` },
      { name: 'reward.level', aliases: ['required_level'], value: data.reward.level.toString() },
    );
  }
}

export class BaseStaffParser extends MemberParser {
  constructor({ member, color, interaction }: BaseStaffParserArgs) {
    super({ member, color });
    this.addVariables({ name: 'staff', aliases: ['moderator'], value: interaction.user.toString() });
  }
}

export class SuggestionParser extends BaseStaffParser {
  constructor(data: SuggestionParserArgs) {
    super(data);

    this.changeVariables({
      name: 'color',
      newValue: data.suggestion.status === 'approved' ? '#57f288' : '#ed4245',
    });

    this.addVariables(
      { name: 'suggestion', value: data.suggestion.suggestion },
      { name: 'state', value: data.suggestion.status },
    );
  }
}

export class ModerationParser extends BaseStaffParser {
  constructor({ member, reason, interaction, color, id }: ModerationParserArgs) {
    super({ member, color, interaction });

    this.addVariables({ name: 'reason', value: reason }, { name: 'id', value: id });
  }
}

export class TimedModerationParser extends ModerationParser {
  constructor(data: TimedModerationParserArgs) {
    super(data);

    this.addVariables({ name: 'duration', value: data.duration });
  }
}

function parseFunctionalVariable(part: string, variable: FunctionalParserVariable) {
  const splitted = part.split('}');
  return variable.value(splitted[0]) + splitted.slice(1).join('}');
}

export interface ParserVariable {
  name: string;
  aliases?: string[] | undefined;
  value: string;
}

export interface FunctionalParserVariable {
  startsWith: string;
  value: (variable: string) => string;
}

export interface TimedModerationParserArgs extends ModerationParserArgs {
  duration: string;
}

export interface ModerationParserArgs extends BaseStaffParserArgs {
  reason: string;
  id: string;
}

export interface SuggestionParserArgs extends BaseStaffParserArgs {
  suggestion: ISuggestion;
}

export interface BaseStaffParserArgs extends MemberParserArgs {
  interaction: Interaction;
}

export interface RewardLevelParserArgs extends LevelParserArgs {
  reward: { level: number; role: Snowflake };
}

export interface LevelParserArgs extends MemberParserArgs {
  channel: GuildChannel | ThreadChannel;
  level: number;
  xp: number;
}

export interface StarMessageArgs extends MemberParserArgs {
  channel: GuildChannel | ThreadChannel;
  emoji: string;
  count: number;
  message: Message | PartialMessage;
}

export interface ReactionRoleParserArgs extends MemberParserArgs {
  action: string;
  role: Role;
  reaction: MessageReaction | ButtonInteraction;
}
export interface BoostParserArgs extends MemberParserArgs {
  guild: Guild;
}

export interface MemberParserArgs {
  member: GuildMember;
  color: ColorResolvable;
}

/*
ALL PARSERS

*/

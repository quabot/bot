const { MessageActionRow, MessageButton } = require('discord.js');

const buttonsJoin = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableJoinMsg')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableJoinMsg')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const buttonsLeave = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableLeaveMsg')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableLeaveMsg')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );

const buttonsCreate = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableChannelCD')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableChannelCD')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );

const buttonsUpdate = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableChannelUpdate')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableChannelUpdate')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );

const buttonsEmoji = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableEmoji')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableEmoji')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const buttonsEmojiU = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableEmojiU')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableEmojiU')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );

const buttonsInvite = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableInvite')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableInvite')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );

    const buttonsMessageD = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enableMessageD')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disableMessageD')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
  
const buttonsMessageU = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('enableMessageU')
        .setLabel('Enable')
        .setStyle('SUCCESS'),
    new MessageButton()
        .setCustomId('disableMessageU')
        .setLabel('Disable')
         .setStyle('DANGER'),
);

const buttonsRoleC = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('enableRoleC')
        .setLabel('Enable')
        .setStyle('SUCCESS'),
    new MessageButton()
        .setCustomId('disableRoleC')
        .setLabel('Disable')
        .setStyle('DANGER'),
);

const buttonsRoleU = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('enableRoleU')
        .setLabel('Enable')
        .setStyle('SUCCESS'),
    new MessageButton()
        .setCustomId('disableRoleU')
        .setLabel('Disable')
        .setStyle('DANGER'),
);

const buttonsVoiceJL = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('enableVoiceJL')
        .setLabel('Enable')
        .setStyle('SUCCESS'),
    new MessageButton()
        .setCustomId('disableVoiceJL')
        .setLabel('Disable')
        .setStyle('DANGER'),
);

const buttonsVoiceM = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('enableVoiceM')
        .setLabel('Enable')
        .setStyle('SUCCESS'),
    new MessageButton()
        .setCustomId('disableRoleU')
        .setLabel('Disable')
        .setStyle('DANGER'),
);

const buttonsMemberU = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('enableMemberU')
        .setLabel('Enable')
        .setStyle('SUCCESS'),
    new MessageButton()
        .setCustomId('disableMemberU')
        .setLabel('Disable')
        .setStyle('DANGER'),
);

const buttonsBotLogs = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('enableBotL')
        .setLabel('Enable')
        .setStyle('SUCCESS'),
    new MessageButton()
        .setCustomId('disableBotL')
        .setLabel('Disable')
        .setStyle('DANGER'),
);

module.exports = {
    buttonsJoin,
    buttonsLeave,
    buttonsCreate,
    buttonsUpdate,
    buttonsEmoji,
    buttonsEmojiU,
    buttonsInvite,
    buttonsMessageD,
    buttonsMessageU,
    buttonsRoleC,
    buttonsRoleU,
    buttonsVoiceJL,
    buttonsVoiceM,
    buttonsMemberU,
    buttonsBotLogs,
}
const discord = require('discord.js');

const HelpSelect = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Fun Commands',
                    description: 'These commands give funny pictures, games and more.',
                    value: 'fun_commands',
                },
                {
                    label: 'Info Commands',
                    description: 'These commands are used to get information about loads of different things.',
                    value: 'info_commands',
                },
                {
                    label: 'Music Commands',
                    description: 'These commands allow you to play music in your voice channel using youtube videos.',
                    value: 'music_commands',
                },
                {
                    label: 'Moderation Commands',
                    description: 'These commands are used to punish users and moderate the server.',
                    value: 'mod_commands',
                },
                {
                    label: 'Misc Commands',
                    description: 'These commands are just general commands that dont fit the descrition of the ones above.',
                    value: 'misc_commands',
                },
            ]),
    );
const selectCategory = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Toggle Features',
                    description: 'Toggle certain settings like log channels, tickets, music and more.',
                    value: 'toggle_features',
                },
                {
                    label: 'Change Channels',
                    description: 'Allows you to change log channel, welcome channel and more channel-related settings.',
                    value: 'change_channels',
                 },
                {
                    label: 'Change Roles',
                    description: 'Allows you to change roles for people who are muted, on join etc.',
                    value: 'change_roles',
                },
            ]),
    );
const levelsButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableLevel')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableLevel')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const logButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableLogs')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableLogs')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const swearButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableSwear')
            .setLabel('Enable')
            .setDisabled(true)
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableSwear')
            .setLabel('Disable')
            .setDisabled(true)
            .setStyle('DANGER'),
    );
const musicButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableMusic')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableMusic')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const reportButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableReport')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableReport')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const suggestButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableSuggest')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableSuggest')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const ticketButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableTicket')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableTicket')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const welcomeButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableWelcome')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableWelcome')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const pollButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enablePoll')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disablePoll')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const disabledToggle = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('disabledE')
            .setLabel('Enable')
            .setDisabled('true')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disabledD')
            .setLabel('Disable')
            .setDisabled('true')
            .setStyle('DANGER'),
    );
const nextPage1 = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('next1')
            .setLabel('Next Page')
            .setStyle('SUCCESS'),
    );
const nextPage2 = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('next2')
            .setLabel('Previous Page')
            .setStyle('DANGER'),
    );
const nextPage3 = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('next3')
            .setLabel('Next Page')
            .setStyle('SUCCESS'),
    );
const nextPage4 = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('next4')
            .setLabel('Previous Page')
            .setStyle('DANGER'),
    );
const disableLevel = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('disablelevel')
            .setLabel('Disable Level-up channel')
            .setStyle('DANGER'),
    );
const toggle = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Levels',
                    description: 'Enable or disable the levels system.',
                    value: 'levels_toggle',
                },
                {
                    label: 'Event Logging',
                    description: 'Enable or disable events logging.',
                    value: 'log_toggle',
                },
                {
                    label: 'Swear Filter',
                    description: 'Enable or disable the swear filter.',
                    value: 'swear_toggle',
                },
                {
                    label: 'Music',
                    description: 'Enable or disable all music related commands.',
                    value: 'music_toggle',
                },
                {
                    label: 'Reports',
                    description: 'Enable or disable reports for your guild.',
                    value: 'report_toggle',
                },
            ]),
    );
const toggle2 = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Suggestions',
                    description: 'Enable or disable the suggestions system.',
                    value: 'suggest_toggle',
                },
                {
                    label: 'Tickets',
                    description: 'Enable or disable the tickets system.',
                    value: 'tickets_toggle',
                },
                {
                    label: 'Welcome Messages',
                    description: 'Enable or disable welcome messages.',
                    value: 'welcome_toggle',
                },
                {
                    label: 'Polls',
                    description: 'Enable or disable the polls system.',
                    value: 'poll_toggle',
                },
            ]),
    );
const channel = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Log Channel',
                    description: 'The channel that guild and command events are sent in.',
                    value: 'log_channel',
                },
                {
                    label: 'Report Channel',
                    description: 'The public channel that user reports are sent in.',
                    value: 'report_channel',
                },
                {
                    label: 'Suggest Channel',
                    description: 'The public channel that suggestions are sent in.',
                    value: 'suggest_channel',
                },
                {
                    label: 'Welcome Channel',
                    description: 'The channel that welcome messages are sent in.',
                    value: 'welcome_channel',
                },
                {
                    label: 'Ticket Category',
                    description: 'The name of the category where tickets are stored.',
                    value: 'ticket_channel',
                },
            ]),
    );
const channel2 = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Closed Tickets Category',
                    description: 'The name of the category where closed tickets are stored.',
                    value: 'closedticket_channel',
                },
                {
                    label: 'Level Up Channel',
                    description: 'The name of the channel used to send level-up messages.',
                    value: 'levelup_channel',
                },
                {
                    label: 'Polls Channel',
                    description: 'The name of the channel used to send poll messages.',
                    value: 'poll_channel',
                },
            ]),
    );
const role = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Main Role',
                    description: 'The main role that users get when being muted/unmuted and get on join *if enabled.',
                    value: 'main_role',
                },
                {
                    label: 'Muted Role',
                    description: 'The role that users get when muted.',
                    value: 'muted_role',
                },
            ]),
    );
const closeTicket = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('close')
            .setLabel('Close')
            .setEmoji('🔒')
            .setStyle('PRIMARY'),
        new discord.MessageButton()
            .setCustomId('delete')
            .setLabel('Delete')
            .setEmoji('🗑️')
            .setStyle('DANGER'),
    );
const closeTicketWCancel = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('close')
            .setLabel('Close')
            .setEmoji('🔒')
            .setStyle('PRIMARY'),
        new discord.MessageButton()
            .setCustomId('cancelclose')
            .setLabel('Cancel')
            .setEmoji('❌')
            .setStyle('DANGER'),
    );
const deleteTicket = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('deleteconfirm')
            .setLabel('Delete')
            .setEmoji('🗑️')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setEmoji('❌')
            .setStyle('DANGER'),
    );
const newMeme = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('meme')
            .setLabel('Next Meme')
            .setStyle('PRIMARY'),
    );
const newCat = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('cat')
            .setLabel('Next Cat')
            .setStyle('PRIMARY'),
    );
const newDog = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('dog')
            .setLabel('Next Dog')
            .setStyle('PRIMARY'),
    );
const pictureButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('memePic')
            .setLabel('Meme')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('dogPic')
            .setLabel('Dog')
            .setStyle('PRIMARY'),
        new discord.MessageButton()
            .setCustomId('catPic')
            .setLabel('Cat')
            .setStyle('DANGER'),
    );
const pictureButtonsDisabled = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('memePic')
            .setLabel('Meme')
            .setStyle('SUCCESS')
            .setDisabled('true'),
        new discord.MessageButton()
            .setCustomId('dogPic')
            .setLabel('Dog')
            .setStyle('PRIMARY')
            .setDisabled('true'),
        new discord.MessageButton()
            .setCustomId('catPic')
            .setLabel('Cat')
            .setStyle('DANGER')
            .setDisabled('true'),
    );
const adminButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('ticketmsg')
            .setLabel('Ticket Message')
            .setStyle('PRIMARY'),
    );
const ticketButton = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('ticket')
            .setLabel('Ticket')
            .setEmoji('📩')
            .setStyle('SECONDARY'),
    );
const reopenButton = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('reopen')
            .setLabel('Reopen')
            .setEmoji('🔓')
            .setStyle('SUCCESS'),
    );
    
module.exports = { pictureButtonsDisabled, pictureButtons, pollButtons, reopenButton, ticketButton, adminButtons, newDog, newCat, newMeme, closeTicketWCancel, deleteTicket, closeTicket, disableLevel, role, channel, nextPage3, nextPage4, channel2, ticketButtons, welcomeButtons, suggestButtons, toggle2, nextPage2, nextPage1, reportButtons, musicButtons, toggle, swearButtons, logButtons, disabledToggle, levelsButtons, selectCategory, HelpSelect }
// * This is the Application CONFIG

const ApplicationConfig = require('../../../structures/schemas/ApplicationConfigSchema');
const ApplicationConfigDatabase = await ApplicationConfig.findOne({
    guildId: interaction.guild.id,
}, (err, config) => {
    if (err) console.log(err);
    if (!config) {
        const newConfig = new ApplicationConfig({
            guildId: interaction.guild.id,
            applicationsEnabled: true,
            applicationLogChannelId: "none",
            applicationAdminRole: "none",
        });
        newConfig.save();
    }
}).clone().catch((err => { }));

if (!ApplicationConfigDatabase) {
    return interaction.reply({
        embeds: [
            new MessageEmbed()
                .setDescription(`We just created a new database record! Please run that command again!`)
                .setColor(color)
        ], ephemeral: true
    }).catch((err => { }));
}




// * This is the Application Itself

const Application = require('../../../structures/schemas/ApplicationSchema');
const ApplicationDatabase = await Application.findOne({
    guildId: interaction.guild.id,
    applicationNumId: reqNum, // !!
    applicationTextId: reqString, // !!
}, (err, application) => {
    if (err) console.log(err);
    if (!application) {
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Could not find that application. Please create one on our [dashboard](https://dashboard.quabot.net)`)
                    .setColor(color)
            ], ephemeral: true
        }).catch((err => { }));
    }
}).clone().catch((err => { }));

if (!ApplicationDatabase) {
    return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setDescription(`Could not find that application. Please create one on our [dashboard](https://dashboard.quabot.net)`)
                .setColor(color)
        ], ephemeral: true
    }).catch((err => { }));
}



// * Thisn is the application answer creation

const ApplicationAnswer = require('../../../structures/schemas/ApplicationConfigSchema');

const newApplication = new ApplicationAnswer({
    guildId: reqString, // ! SET THESE VALUES!!!
    applicationId: reqNum,
    applicationUserId: reqString,
    applicationAnswers: reqArray,
    applicationState: reqString,
});
newApplication.save();


/**
 * Update Schema values with
 * datbaase.updateOne({
 *  id: 1, (example)
 * });
 * 
 * valid options are .findOne, .find, .findOneAndDelete (all ull need)
 */
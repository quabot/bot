const { Schema, model } = require("mongoose");
const { reqString, reqBool, reqArray, reqNum } = require("../../utils/constants/schemas");

const Application = new Schema({
    guildId: reqString,
    id: reqString, //Application ID

    name: reqString, //Form name
    description: optString, //Form description

    questions: reqArray, //Form questions
    //{
    //   question: 'question goes here', // will be shown to user
    //   description: 'description here' // optional description for user
    //   type: string (multiple = multiple choice, checkbox = 1 option selectable, short =  short Text, paragraph = long text),
    //   required: true/false
    //}

    submissions_channel: reqString, //Channel where applications will be posted (also go to dashboard)
    submissions_managers: reqArray, // People that can approve/deny

    ignored_roles: reqArray, //Roles that will not be allowed to use the form
    reapply: reqBool, //Can users apply more than once?
    dashboard_allowed: reqBool, // Can users apply from the dashboard
    anonymous: reqBool, // Should usersnames be visible
    cooldown_enabled: reqBool, // Cooldown enabled?
    cooldown: reqNum, // What is the cooldown

    react_complete: reqBool, // Should a reaction be added when filled out
    reaction: reqString, // What reaction should be added (if enabled)

    add_roles: reqArray, // What roles should be added when approved
    remove_roles: reqArray, // What roles should be removed when approved
});

module.exports = model('Application', Application);
const dotenv = require('dotenv');

const { InstallGlobalCommands } = require('./aux/utils.js');

dotenv.config();

/**
  command types:
  https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types

  command option types:
  https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type

*/


const checkin_command = {
  name: 'checkin',
  description: 'To punch your sign in time and mark your attendance',
  type: 1,  // command type: CHAT_INPUT (slash command)
  "options": [
    {
      "name": "wfh",
      "description": "Are you working from home?",
      "type": 5, // boolean
      "required": true,
      "choices": [
        { name: "No", value: false },
        { name: "Yes", value: true }
      ]
    }
  ]
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const brb_command = {
  name: 'brb',
  description: 'To tell the team you are going away to do nothing',
  type: 1,  // command type: CHAT_INPUT (slash command)
  "options": [
    {
      "name": "est",
      "description": "How long will you be away?",
      "type": 4, // int
      "required": true,
      "choices": [
        { name: "Less than 1 hour", value: 1 },
        { name: "1-2 hours", value: 2 },
        { name: "2-3 hours", value: 3 },
      ]
    }
  ]
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const back_command = {
  name: 'back',
  description: 'To tell the team you came back',
  type: 1,  // command type: CHAT_INPUT (slash command)
  "options": [
    {
      "name": "wfh",
      "description": "Are you working from home?",
      "type": 5, // boolean
      "required": true,
      "choices": [
        { name: "No", value: false },
        { name: "Yes", value: true }
      ]
    }
  ]
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const checkout_command = {
  name: 'checkout',
  description: 'To punch your sign out time',
  type: 1,  // command type: CHAT_INPUT (slash command)
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const report_command = {
  name: 'report',
  description: 'To check checkin status of every member',
  type: 1,  // command type: CHAT_INPUT (slash command)
  "options": [
    {
      "name": "pwd",
      "description": "Enter pwd to generate report of all members",
      "type": 3, // string
      "required": true,
    },
    {
      "name": "report_duration",
      "description": "Duration of report",
      "type": 3, // string
      "required": true,
      "choices": [
        { name: "Last 7 days", value: "last_7_days" },
        { name: "Last 30 days", value: "last_30_days" },
        // { name: "Last month", value: "last_month" },
        // { name: "Last 2 month", value: "last_2_months" }, TODO: work on these commands
      ]
    }
  ]
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const all_commands = [
  checkin_command,
  brb_command,
  back_command,
  checkout_command,
  report_command
];


InstallGlobalCommands( all_commands );
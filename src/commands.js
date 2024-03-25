const dotenv = require('dotenv');

const { InstallGlobalCommands } = require('./utils.js');


dotenv.config();

// Simple test command
const test_command = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};


const all_commands = [
  test_command
];


InstallGlobalCommands( process.env.APP_ID, all_commands );
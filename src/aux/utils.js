const dotenv = require('dotenv');
const { verifyKey } = require('discord-interactions');

dotenv.config();


async function DiscordRequest( endpoint, options ){
    /**
     * This function takes an endpoint and request body options as input arguments
     * and then sends request to the discord REST api endpoints
    */
    
    const url = 'https://discord.com/api/v10/' + endpoint; // making endpoint url
    
    if( options.body ){ // Stringify payloads
        options.body = JSON.stringify(options.body);
    }

    // Using node-fetch to make requests
    const res = await fetch( url, {
        headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`,
            'Content-Type': 'application/json; charset=UTF-8',
        },
        ...options
    });

    if( !res.ok ){ // throw API errors
        const data = await res.json();
        throw new Error( JSON.stringify(data) );
    }
    // return original response
    return res;
}


function VerifyDiscordRequest( client_key ){
    return function( req, res, buf, encoding ){
        const signature = req.get('X-Signature-Ed25519');
        const timestamp = req.get('X-Signature-Timestamp');
    
        const isValidRequest = verifyKey(buf, signature, timestamp, client_key);
        if( !isValidRequest ){
            res.status(401).send('Bad request signature');
            throw new Error('Bad request signature');
        }
    };
}


async function InstallGlobalCommands( BOT_APP_ID, commands){
    /**
     * This function is used to register slash commands for the discord bot
     * All the commands are configured in ./src/commands.js file
     * In order to register the commands, write ```npm run register``` command in the terminal
     * NOTE: This will overwrite all types of application commands
     * such as slash commands, user commands, and message commands.
    */

    const endpoint = `applications/${BOT_APP_ID}/commands`; // API endpoint to overwrite global commands
  
    try{
        // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
        await DiscordRequest( endpoint, { method: 'PUT', body: commands } );

    } catch( err ){
        console.error(err);
    }
}



module.exports = {
    DiscordRequest,
    VerifyDiscordRequest,
    InstallGlobalCommands
};

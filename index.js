const dotenv = require('dotenv');
const express = require('express');
const {
    InteractionType,
    InteractionResponseType,
} = require ('discord-interactions');

const { VerifyDiscordRequest } = require('./src/aux/utils.js');

const { handleCheckin } = require('./src/command_controllers/checkin.js');
const { handleCheckout } = require('./src/command_controllers/checkout.js');
const { handleBrb } = require('./src/command_controllers/brb.js');
const { handleBack } = require('./src/command_controllers/back.js');
const { handleProgressSubmission } = require('./src/modal_controllers/progress_report_modal.js');
const { botIsWorking } = require('./src/aux/bot_helper.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Parse request body and verifies incoming requests using discord-interactions package
app.use(
    express.json({ verify: VerifyDiscordRequest(process.env.BOT_PUBLIC_KEY) })
);

app.post('/interactions', async ( req, res ) => { // Interactions endpoint URL where Discord will send HTTP requests
    // Interaction type and data
    const { type, data } = req.body;

    // ----------------------------------------------------------------------
    // Acknowledging PING requests from Discord
    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }
    
    // ----------------------------------------------------------------------
    // Handeling slash commands

    if( type === InteractionType.APPLICATION_COMMAND ){
        // NOTE: we are not awaiting for the handle commands functions because of the 3000ms 
        // time limit of discord response. Check README.md file for details

        const { name } = data;

        if( name === 'checkin'){
            handleCheckin( req, res );
            return botIsWorking( res );
        }
        
        else if( name === 'checkout'){
            // checkout commands sends a modal in response
            return await handleCheckout( req, res );

        }
        
        else if( name === 'brb'){
            handleBrb( req, res );
            return botIsWorking( res );

        }
        
        else if( name === 'back'){
            handleBack( req, res );
            return botIsWorking( res );

        }

    } 
    
    // Handeling modal submissions
    else if( type === InteractionType.MODAL_SUBMIT ){
        const { custom_id } = data;

        if( custom_id === 'progress_report_modal' ){
            return await handleProgressSubmission(req, res);

        }
    }
    
});



app.get('/fhd', async (req, res) => {
    return res.send({ message: "Roti kha lo" });
})

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});
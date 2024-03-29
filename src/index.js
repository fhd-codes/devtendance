const dotenv = require('dotenv');
const express = require('express');
const {
    InteractionType,
    InteractionResponseType,
} = require ('discord-interactions');

const { VerifyDiscordRequest } = require('./aux/utils.js');

const { handleCheckin } = require('./commands_controller/checkin.js');
const { handleCheckout } = require('./commands_controller/checkout.js');
const { handleBrb } = require('./commands_controller/brb.js');
const { handleBack } = require('./commands_controller/back.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Parse request body and verifies incoming requests using discord-interactions package
app.use(
    express.json({ verify: VerifyDiscordRequest(process.env.BOT_PUBLIC_KEY) })
);

app.post('/interactions', ( req, res ) => { // Interactions endpoint URL where Discord will send HTTP requests
    // Interaction type and data
    const { type, data } = req.body;

    // ----------------------------------------------------------------------
    // Acknowledging PING requests from Discord
    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }
    
    // ----------------------------------------------------------------------
    // Handeling slash commands 

    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;

        switch (name) {
            case 'checkin':
                return handleCheckin(req, res);
            
            case 'checkout':
                return handleCheckout(req, res);
            
            case 'brb':
                return handleBrb(req, res);
            
            case 'back':
                return handleBack(req, res);
            
            default:
              // Handle other cases or provide a default behavior
          }
          




    }
});

app.get('/fhd', async (req, res) => {
    return res.send({ message: "Roti kha lo" });
})

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});
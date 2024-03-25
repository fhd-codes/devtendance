const dotenv = require('dotenv');
const express = require('express');
const {
    InteractionType,
    InteractionResponseType,
} = require ('discord-interactions');

const { VerifyDiscordRequest, DiscordRequest } = require('./utils.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Parse request body and verifies incoming requests using discord-interactions package
app.use(
    express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) })
);

app.post('/interactions', async function ( req, res ){ // Interactions endpoint URL where Discord will send HTTP requests
    // Interaction type and data
    const { type, id, data } = req.body;

    // Handle verification requests
    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
    */
    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;

        if( name === 'test' ){ // "test" command
            // Send a message into the channel where command was triggered from
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'hello world',
                },
            });
        }
    }
});

app.get('/fhd', async (req, res) => {
    return res.send({ message: "Roti kha lo" });
})

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});
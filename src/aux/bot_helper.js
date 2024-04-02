const dotenv = require('dotenv');
const {
    InteractionResponseType,
} = require ('discord-interactions');

const { DiscordRequest } = require('./utils');

dotenv.config();

const botIsWorking = ( res ) => {
    /**
        This function will send a defer response saying that the bot is thinking in order to acknowledge the 
        interaction within 3000ms
        Due to the 3000 ms limit of bot's response, we need to send this response first and then later
        send a follow-up message when all the async requests are completed.
        
        @params = { object } - response object from (req, res)
        @returns = { object } - discord bot defer response
    */

    return res.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    });
}

const botSuccessReply = async ( interaction_token, message ) => {
    /**
        This function will edit the previoulsy sent "bot working message" with the success message
        It uses PATCH request with '/webhooks/{application.id}/{interaction.token}/messages/@original' endpoint
        
        @params = { string, string } - user interaction token, and the final success message
        @returns = { null }
    */
   
    const endpoint = `webhooks/${process.env.BOT_APP_ID}/${interaction_token}/messages/@original`;
    await DiscordRequest( endpoint, { method: 'PATCH', body: {content: message} } );
}


module.exports = {
    botIsWorking,
    botSuccessReply,

}
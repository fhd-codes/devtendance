const { InteractionResponseType } = require ('discord-interactions');
const { isMemberExist, punchTime } = require('../aux/airtable_helper');



const handleCheckout = (req, res) => {

    // TODO: on checkout, ask the user to enter their progress update
    // ask about the progress update in Message Component. 
    // ref: https://discord.com/developers/docs/interactions/message-components

    const { user, data } = req.body;
    let bot_reply = `Remember!\nHard work = Good sleep.\nSmart work = More sleep`;

    isMemberExist( user.id ).then( (res) => {
        if( !res.is_exist ){
            bot_reply = "You are a new member! Checkin first and get yourself registered.";
        
        } else{
            const current_status = res.record.fields.status;

            if( current_status === "offline" ){
                bot_reply = `You are already offline. Where else you want to go?`;
            } else if( current_status === "brb" ){
                bot_reply = `Your current availability status is "brb"\nUse '/back' command first, and then '/checkout' command`;
            }else{
                punchTime( res.record.id, user.id, "out" ); // args: (airtable_record_id, discord_user_id, check in or out)
            }
        }

    }).finally(() => {

        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: bot_reply,
            },
        });
    });


}


module.exports = {
    handleCheckout
};
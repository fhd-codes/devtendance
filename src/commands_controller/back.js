const { InteractionResponseType } = require ('discord-interactions');

const { 
    isMemberExist,
    punchTime,
} = require('../aux/airtable_helper.js');


const handleBack = async (req, res) => {
    const { user, data } = req.body;

    let bot_reply = `Did you bring your creativity?!`;

    // checking if this user already exists in the Airtable or not
    isMemberExist( user.id ).then( (res) => {
        if( !res.is_exist ){
            bot_reply = "You are a new member! Checkin first and get yourself registered.";

        } else{
            const current_status = res.record.fields.status;
            
            if( current_status === "back" || current_status === "offline" || current_status === "available" || current_status === "available_wfh"){
                bot_reply = `Your current status is already ${current_status}`;
            } else{
                // There is a chance that the wfh status is changed when the user comes back after a break
                const wfh = data.options[0].value;
                
                // punching in brb and updating availability status for existing user
                punchTime( 
                    res.record.id, // airtable_record_id
                    user.id, // discord_user_id
                    "back", // punch_type
                    wfh, // wfh
                    "" // notes
                );
                
            }
        }

        
    }).then(() => {

        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: bot_reply,
            },
        });
    })
       
}







module.exports = {
    handleBack
};
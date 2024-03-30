const { InteractionResponseType } = require ('discord-interactions');

const { 
    isMemberExist,
    punchTime,
} = require('../aux/airtable_helper.js');


const handleBack = async (req, res) => {
    const { user, data } = req.body;

    let bot_reply = `Did you bring your creativity?!`;

    try{
        const member_exists = await isMemberExist( user.id );
        if( !member_exists.is_exist ){
            bot_reply = "You are a new member! Checkin first and get yourself registered.";

        } else{
            const current_status = member_exists.record.fields.status;
            
            if( current_status === "back" || current_status === "offline" || current_status === "available" || current_status === "available_wfh"){
                bot_reply = `Your current status is already ${current_status}`;
            } else{
                // There is a chance that the wfh status is changed when the user comes back after a break
                const wfh = data.options[0].value;
                
                // punching in brb and updating availability status for existing user
                punchTime( 
                    member_exists.record.id, // airtable_record_id
                    user.id, // discord_user_id
                    "back", // punch_type
                    wfh, // wfh
                    "" // notes
                );
                
            }

            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: bot_reply,
                },
            });
            
        }
    } catch( error ){
        console.error("Error handling check-in:", error);
        return res.status(500).send("Error handling check-in. Please try again later.");
    }

   

}







module.exports = {
    handleBack
};
const { InteractionResponseType } = require ('discord-interactions');

const { 
    isMemberExist,
    createNewMember,
    punchTime,
} = require('../aux/airtable_helper.js');


const handleCheckin = async (req, res) => {
    const { user, data } = req.body;

    // if the member doing work from home or not: boolean
    const wfh = data.options[0].value;

    let bot_reply = `Wish you a productive day, ${user.global_name}!`;

    // checking if this user already exists in the Airtable or not
    isMemberExist( user.id ).then( (res) => {
        if( !res.is_exist ){
            // if not, then creating the entry in Airtable and punching
            createNewMember( 
                user.id, 
                user.username, 
                user.global_name
            ).then( (new_record) => {
                bot_reply = "Welcome to Devnetix. " + bot_reply;

                // punching in the checkin time and updating availability status for new user
                punchTime( new_record.id, user.id, "in", wfh ); // args: (airtable_record_id, discord_user_id, check in or out, wfh status)
            });
        } else{
            const current_status = res.record.fields.status;

            if( current_status === "available" || current_status === "available_wfh" ){
                bot_reply = "You are already signed in. Signing in again will not increase your salary";
            } else if(current_status === "brb" ){
                bot_reply = `Your current status is "brb", use '/back' command instead`;

            } else{
                // punching in the checkin time and updating availability status for existing user
                punchTime( res.record.id, user.id, "in", wfh ); // args: (airtable_record_id, discord_user_id, check in or out, wfh status)
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
    handleCheckin
};
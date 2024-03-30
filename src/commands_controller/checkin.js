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
    try {
        const member_exists = await isMemberExist( user.id );

        if( !member_exists.is_exist ){
            const new_record = await createNewMember( user.id, user.username, user.global_name );
            
            bot_reply = "Welcome to Devnetix. " + bot_reply;
            punchTime(new_record.id, user.id, "in", wfh);

        } else{
            const current_status = member_exists.record.fields.status;

            if( current_status === "available" || current_status === "available_wfh" ){
                bot_reply = "You are already signed in. Signing in again will not increase your salary";

            } else if( current_status === "brb" ){
                bot_reply = `Your current status is "brb", use '/back' command instead`;

            } else{
                punchTime( member_exists.record.id, user.id, "in", wfh );

            }
        }

        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: bot_reply,
            },
        });

    } catch( error ){
        console.error("Error handling check-in:", error);
        return res.status(500).send("Error handling check-in. Please try again later.");
    }
       
}







module.exports = {
    handleCheckin
};
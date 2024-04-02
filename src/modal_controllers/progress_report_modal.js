const { InteractionResponseType } = require ('discord-interactions');
const { punchTime, isMemberExist } = require('../aux/airtable_helper');
const { botSuccessReply, sendUpdateInChannel } = require('../aux/bot_helper');


const handleProgressSubmission = async (req, res) => {
    const { data, user, token } = req.body;

    const progress_text = data.components[0].components[0].value; // from modal submission
    let bot_reply = `Good work, ${user.global_name}!`;
    
    try{

        const member_exists = await isMemberExist( user.id );
        const ledger_rec = await punchTime( member_exists.record.id, user.id, user.global_name, "out", false, progress_text ); // args: (airtable_record_id, discord_user_id, check in or out)

        await sendUpdateInChannel( `${user.global_name} has signed out` );
        botSuccessReply( token, ledger_rec.length > 0 ? bot_reply : "Opps. I did something wrong.\nCan you try again?" )

    } catch( error ){
        console.error("Error handling check-in:", error);
        return res.status(500).send("Error handling check-in. Please try again later.");
    }
}


module.exports = {
    handleProgressSubmission
}
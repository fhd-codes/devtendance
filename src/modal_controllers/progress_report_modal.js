const { InteractionResponseType } = require ('discord-interactions');
const { punchTime, isMemberExist } = require('../aux/airtable_helper');


const handleProgressSubmission = async (req, res) => {
    const { data, user } = req.body;

    const progress_text = data.components[0].components[0].value; // from modal submission
    let bot_reply = `Good work, ${user.global_name}!`;
    
    try{

        const member_exists = await isMemberExist( user.id );
        punchTime( member_exists.record.id, user.id, "out", false, progress_text ); // args: (airtable_record_id, discord_user_id, check in or out)

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
    handleProgressSubmission
}
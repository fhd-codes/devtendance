const { 
    isMemberExist,
    punchTime,
} = require('../aux/airtable_helper.js');
const { addHoursToCurrentTime } = require('../aux/general_helper.js');
const { botSuccessReply } = require('../aux/bot_helper.js');


const handleBrb = async (req, res) => {
    const { user, data, token } = req.body;

    let bot_reply = `Explore the world and gather creativity!`;

    try{
        const member_exists = await isMemberExist( user.id );
        if( !member_exists.is_exist ){
            bot_reply = "You are a new member! Checkin first and get yourself registered.";

        } else{
            const current_status = member_exists.record.fields.status;

            if( current_status === "brb" || current_status === "offline" ){
                bot_reply = `Your current status is already ${current_status}`;
            } else{
                // punching in brb and updating availability status for existing user
                const ledger_rec = await punchTime( airtable_record_id=member_exists.record.id, discord_user_id=user.id, punch_type="brb", wfh=false, notes=`I'll be back at around ${addHoursToCurrentTime(data.options[0].value)}` );
                bot_reply = ledger_rec.length > 0 ? bot_reply : "Um.. can you try again, I could not update your punch time";
            }

            botSuccessReply( token, bot_reply );

        }
    } catch( error ){
        console.error("Error handling check-in:", error);
        return res.status(500).send("Error handling check-in. Please try again later.");
    }

    
       
}







module.exports = {
    handleBrb
};
const { InteractionResponseType } = require ('discord-interactions');
const { isMemberExist, punchTime } = require('../aux/airtable_helper');


const handleCheckout = async (req, res) => {

    const { user } = req.body;
    let bot_reply = `Remember!\nHard work = Good sleep.\nSmart work = More sleep`;

    try{
        const member_exists = await isMemberExist( user.id );

        if( !member_exists.is_exist ){
            bot_reply = "You are a new member! Checkin first and get yourself registered.";

        } else{
            const current_status = member_exists.record.fields.status;

            if( current_status === "offline" ){
                bot_reply = `You are already offline. Where else you want to go?`;
            
            } else if( current_status === "brb" ){
                bot_reply = `Your current availability status is "brb"\nUse '/back' command first, and then '/checkout' command`;
                
            } else{
                // responding the checkout command with this pop-up modal asking the user to enter today's progress
                // NOTE: On successful modal submission, the checkout time will be punched - check modal submission controller
                return res.send({
                    type: InteractionResponseType.MODAL,
                    data: {
                        title: "Enter your today's progress",
                        custom_id: "progress_report_modal",
                        components: [{
                            type: 1,
                            components: [{
                                type: 4, // text input
                                custom_id: "progress_report",
                                label: "Progress",
                                style: 2, // paragraph
                                min_length: 1,
                                max_length: 4000,
                                placeholder: "I did timepass today...",
                                required: true
                            }]
                        }]
                    },
                });

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
    handleCheckout
};
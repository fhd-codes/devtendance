const { InteractionResponseType } = require ('discord-interactions');

const { 
    isMemberExist,
    createNewMember,
    punchCheckInTime,
} = require('../aux/airtable_helper.js');


const handleCheckin = async (req, res) => {
    const { user, data } = req.body;

    // if the member doing work from home or not: boolean
    const wfh = data.options[0].value;

    let checkin_bot_reply = `Wish you a productive day, ${user.global_name}!`;

    // checking if this user already exists in the Airtable or not
    isMemberExist( user.id ).then( (res) => {
        if( !res.is_exist ){
            // if not, then creating the entry in Airtable and punching
            createNewMember( 
                user.id, 
                user.username, 
                user.global_name
            ).then( (new_record) => {
                checkin_bot_reply = "Welcome to Devnetix. " + checkin_bot_reply;

                // punching in the checkin time and updating availability status
                punchCheckInTime( new_record.id, wfh );
                console.log("new record is made");
            });
        } else{
            // punching in the checkin time and updating availability status
            punchCheckInTime( res.record.id, wfh );

        }

        
        
    }).then(() => {
        console.log("done here");

        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: checkin_bot_reply,
            },
        });
    })
       
}







module.exports = {
    handleCheckin
};
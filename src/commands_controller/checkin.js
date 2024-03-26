const { InteractionResponseType } = require ('discord-interactions');

const { 
    isMemberExist,
    createNewMember
} = require('../aux/airtable_helper.js');


const handleCheckin = async (req, res) => {
    const { user } = req.body;

    // checking if this user already exists in the Airtable or not
    // if not, then creating the entry
    if( ! await isMemberExist( user.id ) ){
        console.log("Creating a new entry");
        const records = await createNewMember( 
            user.id, 
            user.username, 
            user.global_name 
        );

        console.log("new record", records);
    }

    console.log("done here");

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Wish you a productive day, ${user.global_name}!`,
        },
    });

}




module.exports = {
    handleCheckin
};
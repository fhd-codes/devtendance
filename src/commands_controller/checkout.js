const { InteractionResponseType } = require ('discord-interactions');



const handleCheckout = (req, res) => {

    // TODO: on checkout, ask the user to enter their progress update
    // ask about the progress update in Message Component. 
    // ref: https://discord.com/developers/docs/interactions/message-components


    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Remember!\nHard work = Good sleep.\nSmart work = More sleep`,
        },
    });
}


module.exports = {
    handleCheckout
};
const { InteractionResponseType } = require ('discord-interactions');


const handleCheckin = (req, res) => {
    const { user } = req.body;



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
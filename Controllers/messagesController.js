const messageCollection = require("../Modal/messageModal")

module.exports.addMessage = async (req, res, next) => {
    try {
        const {from, to, message} = req.body;
        const data = await messageCollection.create({
            message:{text:message},
            users:[from, to],
            sender: from,
        });
        if(data){
            return res.json({msg:"Message added successfully"})
        } else{
            return res.json({msg:"failed added messages"})
        }
    } catch (ex) {
        next(ex)
    }
}

module.exports.getAllMessage = async (req, res, next) => {
    try {
        const {from, to} = req.body;
        const message = await messageCollection.find({
            users: {
                $all: [from,to]  //if user1 and user2 chat together then it will show all the messages between them

            }
        }).sort({updatedAt: 1});
        const projectedMessages = message.map((msg) => {
            return {
                fromSelf:msg.sender.toString() === from,
                message: msg.message.text,
            }
        });
        return res.json(projectedMessages)
    } catch (ex) {
        next(ex)
    }
}

const ConversationModel = require("../models/conversation.model");
const MessageModel = require("../models/message.model");

exports.createConversationController = async (req, res) => {
    try {
        let senderId = req.user._id;
        let { recieverId, message } = req.body;

        let isConvExist = await ConversationModel.findOne({
            members: { $all: [senderId, recieverId]}
        })

        if(!isConvExist) {
            let newConversation = new ConversationModel({
                members: [senderId, recieverId]
            })
            await newConversation.save();
            let addMessage = new MessageModel({
                sender: req.user._id,
                conversation: newConversation._id,
                message
            });
            await addMessage.save();
        } else {
            let addMessage = new MessageModel({
                sender: req.user._id,
                conversation: isConvExist._id,
                message
            });
            await addMessage.save();
        }

        res.status(201).json({
            message: "Message sent!"
        })
    } catch (error) {
        console.log("error in createConversationController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}

exports.getConversationController = async (req, res) => {
    try {
        let loggedInId = req.user._id;
        let conversations = await ConversationModel.find({
            members: { $in: [loggedInId] }
        }).populate('members', '-password').sort({ createdAt: -1 });

        res.status(200).json({
            message: "fetched all conversations!",
            conversations
        })
    } catch (error) {
        console.log("error in getConversationController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}
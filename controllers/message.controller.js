
const MessageModel = require("../models/message.model");

exports.sendMessageController = async (req, res) => {
    try {
        let { conversation, message, picture } = req.body;
        console.log('picture:', picture)
        console.log('message:', message)
        console.log('conversation:', conversation)
        let saveSendMessage = new MessageModel({
            sender: req.user._id,
            conversation,
            message,
            picture
        });

        await saveSendMessage.save();

        let populatedMessage = await saveSendMessage.populate("sender", "-password");
        res.status(201).json({
            message: "message has been save!",
            messagesData: populatedMessage
        })
    } catch (error) {
        console.log("error in sendMessageController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}

exports.getAllConvMessagesController = async (req, res) => {
    try {
        let { convId } = req.params;
        let messages = await MessageModel.find({
            conversation: convId
        }).populate("sender", '-password');

        res.status(200).json({
            message: "Messages has been fetched successfully!",
            messagesData: messages
        })
    } catch (error) {
        console.log("error in getAllConvMessagesController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}
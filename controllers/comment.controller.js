
const CommentModel = require("../models/comment.model");
const PostModel = require("../models/post.model");
const NotificationModel = require("../models/notification.model");

exports.createNewCommentController = async (req, res) => {
    try {
        const { postId, comment } = req.body;
        const userId = req.user._id

        const postExist = await PostModel.findById(postId).populate('user', '-password');
        if(!postExist) {

            return res.status(404).json({
                error: 'No such post found'
            })
        }

        postExist.comments = postExist.comments + 1;
        await postExist.save();

        const newComment = new CommentModel({ user: userId, post: postId, comment})
        await newComment.save();

        const populateComment = await CommentModel.findById(newComment._id).populate('user', 'f_name headline profile_pic');
        
        const content = `${req.user.f_name} has commented on your Post`;
        const notification = new NotificationModel({
            sender: userId,
            reciever: postExist.user._id,
            content,
            type: 'comment',
            post_id: postId
        })
        await notification.save();

        return res.status(200).json({
            message: 'Commented Successfully',
            comment: populateComment
        })

    } catch (error) {
        console.log("error in createNewCommentController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}

exports.getPostCommentController = async (req, res) => {
    try {
        const { postId } = req.params;
        const isPostExist = await PostModel.findById(postId);
        
        if(!isPostExist) {
            return res.status(400).json({
                error: 'No such post found'
            })
        }

        const comments = await CommentModel.find({post: postId}).sort({ createdAt: -1 }).populate("user", "f_name headline profile_pic");

        res.status(201).json({
            message: "Comments fetched",
            comments
        })
    } catch (error) {
        console.log("error in getPostCommentController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}
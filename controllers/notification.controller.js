
const NotificationModel = require("../models/notification.model");

exports.getNotificationController = async (req, res) => {
    try {
        let ownId = req.user._id;
        let notifications = await NotificationModel.find({ reciever: ownId }).sort({ createdAt: -1 }).populate('sender', '-password')

        res.status(200).json({
            message: 'Notification fetched successfully!',
            notifications: notifications
        })

    } catch (error) {
        console.log("error in getNotificationController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}

exports.updateReadStatusController = async (req, res) => {
    try {
        const { notificationId } = req.body;
        const notification = await NotificationModel.findByIdAndUpdate(notificationId, { is_read: true })

        if(!notification) {
            return res.status(404).json({
                error: 'Notification not found'
            })
        }

        res.status(200).json({
            message: 'Read Notification'
        })

    } catch (error) {
        console.log("error in updateReadStatusController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}


exports.updateUnreadNotificationController = async (req, res) => {
    try {
        let ownId = req.user._id;
        let notifications = await NotificationModel.find({ reciever: ownId, is_read: false })

        return res.status(200).json({
            message: 'Notification number fetched successfully',
            count: notifications.length
        })

    } catch (error) {
        console.log("error in updateUnreadNotificationController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}
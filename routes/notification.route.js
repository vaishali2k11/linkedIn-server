
const express = require("express");

const route = express.Router();
const Authentication = require("../authentication/auth.authentication");
const NotificationController = require("../controllers/notification.controller");

route.get("/get-notification", Authentication.authAuthentication, NotificationController.getNotificationController);
route.put("/update-notification-read-status", Authentication.authAuthentication, NotificationController.updateReadStatusController);
route.get("/unread-notification", Authentication.authAuthentication, NotificationController.updateUnreadNotificationController);

module.exports = route;
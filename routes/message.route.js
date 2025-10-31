
const express = require("express");

const route = express.Router();
const Authentication = require("../authentication/auth.authentication");
const MessageController = require("../controllers/message.controller");

route.post("/send-message", Authentication.authAuthentication, MessageController.sendMessageController);
route.get("/get-conv-messages/:convId", Authentication.authAuthentication, MessageController.getAllConvMessagesController);

module.exports = route;
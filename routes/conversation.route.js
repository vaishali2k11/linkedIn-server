
const express = require("express");

const route = express.Router();
const Authentication = require("../authentication/auth.authentication");
const ConversationController = require("../controllers/conversation.controller");

route.post("/create-conversation", Authentication.authAuthentication, ConversationController.createConversationController)
route.get("/get-conversation", Authentication.authAuthentication, ConversationController.getConversationController)

module.exports = route;
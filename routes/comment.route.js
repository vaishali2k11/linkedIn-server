
const express = require("express");

const route = express.Router();
const Authentication = require("../authentication/auth.authentication");
const CommentController = require("../controllers/comment.controller");

route.post("/create-comment", Authentication.authAuthentication, CommentController.createNewCommentController)
route.get("/get-post-comment/:postId", Authentication.authAuthentication, CommentController.getPostCommentController)

module.exports = route;
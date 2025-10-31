const express = require("express");

const route = express.Router();
const Authentication = require("../authentication/auth.authentication");
const PostController = require("../controllers/post.controller");

route.post(
  "/create-post",
  Authentication.authAuthentication,
  PostController.createPostController
);
route.put(
  "/like-dislike",
  Authentication.authAuthentication,
  PostController.doLikeAndDislikeController
);
route.get(
  "/get-all-post",
  Authentication.authAuthentication,
  PostController.getAllPostController
);
route.get(
  "/get-post-by-id/:postId",
  Authentication.authAuthentication,
  PostController.getSinglePostById
);
route.get(
  "/get-top-5-post-for-user/:userId",
  Authentication.authAuthentication,
  PostController.getTop5PostForUser
);
route.get(
  "/get-all-post-for-user/:userId",
  Authentication.authAuthentication,
  PostController.getAllPostForUser
);

module.exports = route;

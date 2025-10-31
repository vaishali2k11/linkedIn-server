const express = require("express");

const route = express.Router();
const UserController = require("../controllers/user.controller");
const Authentication = require("../authentication/auth.authentication");

route.post("/register", UserController.registerController);
route.post("/login", UserController.loginController);
route.post("/google", UserController.loginThroughGoogleController);
route.put(
  "/update-user",
  Authentication.authAuthentication,
  UserController.updateUserController
);
route.get(
  "/user/:id",
  Authentication.authAuthentication,
  UserController.getUserProfileById
);
route.post(
  "/logout",
  Authentication.authAuthentication,
  UserController.logOutUserController
);
route.get("/find-user", Authentication.authAuthentication, UserController.findUserWhileSearchingController);
route.post("/send-friend-request", Authentication.authAuthentication, UserController.sendFriendRequestController)
route.post("/accept-friend-request", Authentication.authAuthentication, UserController.acceptFriendRequestController);
route.get("/get-all-friend", Authentication.authAuthentication, UserController.getAllFriendsController);
route.get("/get-pending-friend", Authentication.authAuthentication, UserController.getPendingFriendController)
route.delete("/remove-friend/:friendId", Authentication.authAuthentication, UserController.removeFriendFromListController)

route.get("/self", Authentication.authAuthentication, (req, res) => {
  console.log("req.user :", req.user);

  res.json({
    user: req.user,
  });
});

module.exports = route;

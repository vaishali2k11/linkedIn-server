const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
require("./connection");
require("dotenv").config({ path: "./config.env" });

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());


const UserRoute = require("./routes/user.route");
const PostRoute = require("./routes/post.route");
const NotificationRoute = require("./routes/notification.route");
const CommentRoute = require("./routes/comment.route");
const ConversationRoute = require("./routes/conversation.route");
const MessageRoute = require("./routes/message.route");

app.use("/api/auth", UserRoute);
app.use("/api/post", PostRoute);
app.use("/api/notification", NotificationRoute);
app.use("/api/comment", CommentRoute);
app.use("/api/conversation", ConversationRoute);
app.use("/api/message", MessageRoute);

app.listen(PORT, () => {
  console.log("Backend server is running  on Port :", PORT);
});

exports.createNewComment = async (req, res) => {
    try {

    } catch (error) {
        console.log("error in updateUnreadNotificationController():", error.message);
        res.status(500).json({
            error: "Server error",
            message: error.message,
        });
    }
}
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']

    }
})

require("./connection");
require("dotenv").config({ path: "./config.env" });
// const NotificcationModel = require("./models/comment.model");

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));

io.on('connection', (socket) => {
    socket.on("joinConversation", (conversationId) => {
        if(socket.rooms.has(conversationId)) {
            console.log(`Already joined room ${conversationId}`);
            return;
        }
        socket.join(conversationId);
        console.log(`User joined Conversation Id of ${conversationId}`);
    })

    socket.on("sendMessage", (convId, messageDetail) => {
        io.to(convId).emit("receiveMessage", messageDetail);
    })
})

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

server.listen(PORT, async () => {
    // await NotificcationModel.deleteMany();
    console.log("Backend server is running  on Port :", PORT);
});
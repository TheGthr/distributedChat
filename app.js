const logger = require("./utils/logger");
const express = require("express");
const app = express();

app.use(express.static("public"));
app.get("/", (req, res) => {
    res.render("index");
});
server = app.listen(3000);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
    logger.info("New user connected");
    console.log("New user connected");
    socket.username = "Anonymous";

    socket.on("changeUsername", (data) => {
        socket.username = data.username
        logger.info(`Username changed: ${socket.username}`);
    });

    socket.on("logout", () => {
        logger.info(`User logged out: ${socket.username}`);
        socket.username = "Anonymous";
    });

    socket.on("newMessage", (data) => {
        io.sockets.emit("newMessage", {
            message: data.message,
            username: socket.username
        });
    });

    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", {
            username: socket.username
        });
    });

    socket.on("noTyping", (data) => {
        socket.broadcast.emit("noTyping", {
            username: socket.username
        });
    });
});
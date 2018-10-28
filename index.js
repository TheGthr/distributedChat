
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = 3000;
let people = {};
let nbPpl = 0;
let connected = false;

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
    socket.on("disconnect", function () {
        nbPpl -= 1;
        console.log("a user disconnected, nb ppl: " + nbPpl);
    });
    socket.on("chat message", function (msg) {
        console.log("message: " + msg);
        io.emit("chat message", msg);
    });
});

io.on("connection", (socket) => {
    nbPpl += 1;
    console.log("a user connected, nb ppl: " + nbPpl);
});

http.listen(port, function () {
    console.log("listening on localhost:" + port);
});
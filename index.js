const logger = require("./utils/logger");
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const fs = require('fs');
const RedisClustr = require('redis-clustr');
const RedisClient = require('redis');
const redis = new RedisClustr({
    servers: [{
        host: '127.0.0.1',
        port: 6379
    }, {
        host: '10.0.2.15', // Xubuntu
        port: 6380
    }, {
        host: '10.0.2.15', // Xubuntu
        port: 6381
    }, {
        host: '10.0.2.15', // OpenSuse
        port: 6382
    }, {
        host: '10.0.2.15', // OpenSuse
        port: 6383
    }],
    slaves: 'share',
    createClient: function (port, host) {
        // this is the default behaviour
        return RedisClient.createClient(port, host);
    }
});

let creds = '';
let client = '';

// Read credentials from JSON
fs.readFile('redis.json', 'utf-8', function (err, data) {
    if (err) throw err;
    creds = JSON.parse(data);
    client = redis.createClient(6381, "10.0.2.15");
    console.log(client.connection_options)

    // Redis Client Ready
    client.once('ready', function () {

        // Flush Redis DB
        client.flushdb();

        // Initialize Chatters
        client.get('chatUsers', function (err, reply) {
            if (reply) {
                chatters = JSON.parse(reply);
            }
        });

        // Initialize Messages
        client.get('chatAppMessages', function (err, reply) {
            if (reply) {
                chatMessages = JSON.parse(reply);
            }
        });
    });
});

let port = process.env.PORT || 8080;

// Start the Server
http.listen(port, function () {
    console.log('Server Started. Listening on http://localhost:' + port);
});

// Store people in chatroom
let chatters = [];

// Store messages in chatroom
let chatMessages = [];

// Express Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Render Main HTML file
app.get('/', function (req, res) {
    res.sendFile('views/index.html', {
        root: __dirname
    });
});

// API - Join Chat
app.post('/join', function (req, res) {
    let username = req.body.username;
    if (chatters.indexOf(username) === -1) {
        logger.info(req.ip);
        logger.info(req.port);
        logger.info(`Username set: ${username}`);
        chatters.push(username);
        client.set('chatUsers', JSON.stringify(chatters));
        res.send({
            'chatters': chatters,
            'status': 'OK'
        });
    } else {
        logger.warn(`Username already exists: ${username}`);
        res.send({
            'status': 'FAILED'
        });
    }
});

// API - Leave Chat
app.post('/leave', function (req, res) {
    let username = req.body.username;
    chatters.splice(chatters.indexOf(username), 1);
    client.set('chatUsers', JSON.stringify(chatters));
    res.send({
        'status': 'OK'
    });
    logger.info(`User logged out: ${username}`);
});

// API - Send + Store Message
app.post('/sendMessage', function (req, res) {
    let username = req.body.username;
    let message = req.body.message;
    let time = req.body.time;
    chatMessages.push({
        'sender': username,
        'message': message,
        'time': time
    });
    client.set('chatAppMessages', JSON.stringify(chatMessages));
    res.send({
        'status': 'OK'
    });
});

// API - Get Messages
app.get('/getMessages', function (req, res) {
    res.send(chatMessages);
});

// API - Get Chatters
app.get('/getChatters', function (req, res) {
    res.send(chatters);
});

// Socket Connection
// UI Stuff
io.on('connection', function (socket) {
    logger.info("New node opened");

    // Fire 'send' event for updating Message list in UI
    socket.on('message', function (data) {
        io.emit('send', data);
    });

    // Fire 'countChatters' for updating Chatter Count in UI
    socket.on('updateChatterCount', function (data) {
        io.emit('countChatters', data);
    });
});
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const {Users} = require('./utils/users');
const {isRealString} = require('./utils/validation');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '..', '/public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {

        socket.join(params.room.toLowerCase());

        socket.on('createMessage', (message, callback) => {
            var user = users.getUser(socket.id);
            if (user && isRealString(message.text)) {
                io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
            }
            callback();
        });

        socket.on('createLocationMessage', (coords) => {
            var user = users.getUser(socket.id);
            if (user) {
                io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
            }
        });


        //to everyone in the room
        //io.to(params.room).emit();
        //to everyone but sender in the room
        //socket.broadcast.to(params.room).emit();

        users.removeUser(socket.id);
        users.adduser(socket.id, params.name, params.room.toLowerCase())
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat room my friend!'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the room.`));


        callback();
    });

    socket.on('getRooms', (callback) => {
         var rooms = users.getRoomList();
        if (rooms.length > 0) {
            return callback(rooms);
        }
        return callback(['']);
    });

    socket.on('joinRequest',(credentials,callback) =>
    {
        if (!isRealString(credentials.username)) {
            return callback('Name is required');
        }
         if (!isRealString(credentials.roomname)) {
            return callback('Room name are required');
        }
        if (users.getUserList(credentials.roomname).includes(credentials.username)) {
            return callback(`Sorry, this name '${credentials.username}' is already taken!`);
        }

        callback();
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
        }
    });
});


server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});
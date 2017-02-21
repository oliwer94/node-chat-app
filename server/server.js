const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '..', '/public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');
   
    socket.emit('newMessage',{from:'Admin',text:'Welcome to the chat room my friend!'});
    socket.broadcast.emit('newMessage',{text:'Good day everyone it me here',from: 'josefin'});

    socket.on('createMessage',(message) => {
         io.emit('newMessage',{from:message.from,text:message.text,createdAt: new Date().getTime().toString()})
        //console.log('created a message: ',message);
        //socket.broadcast.emit('newMessage',{from:message.from,text: message.text,createdAt:new Date().getTime()})
    });


    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});
var socket = io();

socket.on('connect', function()  {
    console.log('connected to server');

   // socket.emit('createEmail',{text:"data",toAddress:"asd@asd.vom"});

    socket.on('newMessage', function(message){
        console.log('NEW message: ',message);
    });

});

socket.on('disconnect', function()  {
    console.log('Disconnected from server');
});

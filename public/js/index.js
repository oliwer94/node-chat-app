var socket = io();

socket.on('connect', function () {
});

socket.on('disconnect', function () {
});

socket.emit('getRooms', function (values) {
    var _select = $('<select>');
    _select.empty(); // remove old options
    $.each(values, function (value) {
        _select.append($("<option></option>")
            .attr("value", value).text(values[value]));
    });
    $('#rooms').append(_select.html());
});


jQuery('#credentials-form').on('submit', function (e) {
    console.log('im here');
    e.preventDefault();
    var username = jQuery('[name=name]').val();;
    var roomname = jQuery('[name=room]').val();
    console.log(username,roomname);
    socket.emit('joinRequest', {
        username, roomname
    }, function (err) {
        if (err) {
             alert(err);
        }
        else
        {
            window.location.href = `/chat.html?name=${username}&room=${roomname}`;           
        }
    });
});

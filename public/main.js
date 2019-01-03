$(function () {
    let socket = io();
    let chatterCount;
    let message = $("#message");
    $.get('/getChatters', function (response) {
        $('.chat-info').text(response.length + " people");
        chatterCount = response.length; //update chatter count
    });
    $('#crash').click(function () {
        location.reload();
    });
    $('#join-chat').click(function () {
        let username = $.trim($('#username').val());
        if (username.length !== 0) { //username is not empty
            $.ajax({
                url: '/join',
                type: 'POST',
                data: {
                    username: username
                },
                success: function (response) {
                    if (response.status == 'OK') { //username doesn't already exists
                        socket.emit('updateChatterCount', {
                            'action': 'increase'
                        });
                        $('.chat').show();
                        $('#leave-chat').data('username', username);
                        $('#send-message').data('username', username);
                        $.get('/getMessages', function (response) {
                            if (response.length > 0) {
                                let messageCount = response.length;
                                let html = '';
                                for (let x = 0; x < messageCount; x++) {
                                    html += "<p class='message'><span class='pm'>&lt;" + response[x]['sender'] + "&gt;</span> " + response[x]['message'] + "<span class='pull-right text-muted'>" + response[x]['time'] + "</span></p>";
                                }
                                $('.messages').html(html);
                            }
                        });
                        $('.join-chat').hide(); //hide the container for joining the chat room.
                    } else if (response.status == 'FAILED') { //username already exists
                        alert("Already existing username");
                        $('#username').val('').focus();
                    }
                }
            });
        }
    });
    $('#leave-chat').click(function () {
        let username = $(this).data('username');
        let time = new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        $.ajax({
            url: '/leave',
            type: 'POST',
            dataType: 'json',
            data: {
                username: username
            },
            success: function (response) {
                if (response.status == 'OK') {
                    socket.emit('message', {
                        'username': username,
                        'message': "has left the chat room.",
                        'time': time
                    });
                    socket.emit('updateChatterCount', {
                        'action': 'decrease'
                    });
                    $('.chat').hide();
                    $('.join-chat').show();
                    $('#username').val('');
                }
            }
        });
    });
    $('#send-message').click(function () {
        let username = $(this).data('username');
        let message = $.trim($('#message').val());
        let time = new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        if (message.length !== 0) {
            $.ajax({
                url: '/sendMessage',
                type: 'POST',
                dataType: 'json',
                data: {
                    'username': username,
                    'message': message,
                    'time': time
                },
                success: function (response) {
                    if (response.status == 'OK') {
                        socket.emit('message', {
                            'username': username,
                            'message': message,
                            'time': time
                        });
                        $('#message').val('');
                    }
                }
            });
        }
    });
    message.bind("keypress", () => {
        socket.emit("typing");
    });
    socket.on("typing", (data) => {
		$('.messages').html("<p><i><span class='pm'>&lt;" + data.username + "&gt;</span> writing..." + "</i></p>");
		setTimeout(() => {
			$('.messages').html("");
		}, 1500);
	});
    socket.on('send', function (data) {
        let username = data.username;
        let message = data.message;
        let time = data.time;
        let html = "<p class='message'><span class='pm'>&lt;" + username + "&gt;</span> " + message + "<span class='pull-right text-muted'>" + time + "</span></p>";
        $('.messages').append(html);
    });
    socket.on('countChatters', function (data) {
        if (data.action == 'increase') {
            chatterCount++;
        } else {
            chatterCount--;
        }
        $('.chat-info').text(chatterCount + " people");
    });
});
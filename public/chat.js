$(function () {
	//make connection
	let socket = io.connect('http://localhost:3000');

	let time = new Date().toLocaleDateString("en-GB", {
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});

	//buttons and inputs
	let message = $("#message");
	let username = $("#username");
	let send_message = $("#send_message");
	let send_username = $("#send_username");
	let chatroom = $("#chatroom");
	let feedback = $("#feedback");

	//Emit message
	send_message.click(function () {
		socket.emit('new_message', {
			message: message.val()
		});
	});

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		// chatroom.append("<p class='message'><span class='pm'>&lt;" + data.username + "&gt;</span> " + data.message + "</p>");
		$("#chatroom #feedback:last").before("<p class='message'><span class='pm'>&lt;" + data.username + "&gt;</span> " + data.message + "</p>");
		let $scroll = $(".scroll-div");
		$scroll.scrollTop($scroll.prop("scrollHeight"));
	});

	//Emit a username
	send_username.click(function () {
		socket.emit('change_username', {
			username: username.val()
		});
		$("#input_zone").css("display", "block");
		$("#formPseudo").css("display", "none");
	});

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing');
	});

	message.bind("keyup", () => {
		socket.emit('noTyping');
	});

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i><span class='pm'>&lt;" + data.username + "&gt;</span> writing..." + "</i></p>");
	});

	socket.on('noTyping', () => {
		feedback.html(" ");
	});
});
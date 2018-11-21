let logged = false;
let socket = io.connect("http://localhost:3000");
let time;

$(function () {
	let message = $("#message");
	let username = $("#username");
	let sendMessage = $("#sendMessage");
	let sendUsername = $("#sendUsername");
	let chatroom = $("#chatroom");
	let feedback = $("#feedback");
	let logout = $("#logoutBtn");
	let crash = $("#crashBtn");

	sendMessage.click(() => {
		socket.emit("newMessage", {
			message: message.val()
		});
	});

	socket.on("newMessage", (data) => {
		time = new Date().toLocaleDateString("en-GB", {
			day: "numeric",
			month: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit"
		});
		feedback.html("");
		message.val("");
		$("#chatroom #feedback:last").before("<p class='message'><span class='pm'>&lt;" + data.username + "&gt;</span> " + data.message + "<span class='pull-right text-muted'>" + time + "</span></p>");
		let $scroll = $(".scroll-div");
		$scroll.scrollTop($scroll.prop("scrollHeight"));
	});

	sendUsername.click(() => {
		if (username.val() !== "") {
			socket.emit("setUsername", {
				username: username.val()
			});
			$("#formPseudo").css("display", "none");
			$("#inputZone").css("display", "block");
			message.focus();
			logout.css("display", "inline-block");
			logged = true;
		}
	});

	logout.click(() => {
		if (logged) {
			$("#formPseudo").css("display", "block");
			$("#inputZone").css("display", "none");
			username.val("");
			username.focus();
			logged = false;
			logout.css("display", "none");
			socket.emit("logout");
		}
	});

	crash.click(() => { // PB AVEC CETTE FONCTION
		// window.close();
		// opener.window.focus();
		// socket.disconnect();
	});

	message.bind("keydown", () => {
		socket.emit("typing");
	});

	message.bind("keyup", () => {
		socket.emit("noTyping");
	});

	socket.on("typing", (data) => {
		feedback.html("<p><i><span class='pm'>&lt;" + data.username + "&gt;</span> writing..." + "</i></p>");
	});

	socket.on("noTyping", () => {
		feedback.html("");
	});
});
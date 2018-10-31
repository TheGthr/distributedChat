let pseudo;

function pseudoFun() {
    let userInput = document.getElementById("pseudoForm").value;
    if (userInput !== "") {
        pseudo = userInput;
        console.log(pseudo);
        document.getElementById("formPseudo").style.display = "none";
        document.getElementById("formMessages").style.display = "block";
    }
}

$(function () {
    let socket = io();
    $("#formMessages").submit(function () {
        socket.emit("chat message", $("#m").val());
        $("#m").val("");
        return false;
    });
    socket.on("chat message", function (msg) {
        let time = new Date().toLocaleDateString("en-GB", {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        $("#messages").append($("<li>", {
            "class": "list-group-item"
        }).append($("<h4>", {
            text: pseudo
        }).append($("<small>", {
            text: " " + time
        }))).append($("<p>", {
            text: msg
        })));
    });
    socket.on("connection", function () {
        $("#messages").append($("<li>").text("New user connected"));
    });
});
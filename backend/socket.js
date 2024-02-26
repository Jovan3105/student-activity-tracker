const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

let game;
let players = [];
let scoreboard;
let subject;

io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    socket.on("setupGame", (newGame, newScoreboard, newSubject) => {
        socket.join(newGame.pin);
        console.log("Host: " + socket.id + " Game: " + newGame.pin);
        game = newGame;
        scoreboard = newScoreboard;
        players = [];
        subject = newSubject;
    });

    socket.on("addPlayer", (user, pin, callback) => {
        //console.log(typeof (game.pin), typeof (pin));
        if (!game) {
            callback("No active games.", user._id);
            return;
        }
        if (game.pin == pin) {

            if (!subject.studentList.includes(user._id)) {
                //console.log(user._id);
                callback("Subscribe to the subject before playing the game.", user._id);
                return;
            }

            if (!players.some((player) => player._id === user._id)) {
                players.push({ name: user.name, _id: user._id });
                callback("Pass", game._id);
            }
            else {
                callback("User already added.", user._id);
                return;
            }

            console.log(players)
            //console.log("addPlayer true")
            socket.join(game.pin);
            let player = players.find((player) => player._id === user._id);
            io.emit("addedPlayer", player);
        } else {
            callback("No matching pin.", game._id);
        }
    });

    socket.on("startGame", () => {
        console.log("Game " + game.pin + " is started");
        socket.to(game.pin).emit("redirectPlayers", game._id);
    })

    // Signal that host sends. Starts the countdown before the questions shows
    socket.on("questionCountdown", (callback) => {
        callback();
        socket.to(game.pin).emit("questionCountdownFromHost");
    });

    // Signal that host sends. Starts the countdown during the questions
    socket.on("questionCountdownForPlayer", (time, question) => {
        socket.to(game.pin).emit("questionCountdownForPlayerFromHost", time, question);
    })

    socket.on("gameOver", () => {
        socket.to(game.pin).emit("gameOverFromHost");
    })

});

io.listen(3000);

function getSocketInstance() {
    if (!io) {
        throw new Error('Socket.IO not initialized.');
    }
    return io;
}

module.exports = { getSocketInstance }
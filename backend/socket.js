const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

// let game;
// let players = [];
// let scoreboard;
// let subject;

// Store active games in an object with pin as key
let activeGames = new Map();

io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    socket.on("setupGame", (newGame, newScoreboard, newSubject) => {
        const gameId = newGame.pin;
        socket.join(gameId);
        console.log("Host: " + socket.id + " Game: " + gameId);

        activeGames.set(gameId, {
            game: newGame,
            scoreboard: newScoreboard,
            players: [],
            subject: newSubject
        });
    });

    socket.on("addPlayer", (user, pin, callback) => {
        if (!activeGames.get(pin)) {
            callback("No active games.", user._id);
            return;
        }

        const game = activeGames.get(pin);

        if (!game.subject.studentList.includes(user._id)) {
            callback("Subscribe to the subject before playing the game.", user._id);
            return;
        }

        if (!game.players.some((player) => player._id === user._id)) {
            game.players.push({ name: user.name, email: user.email, _id: user._id });
            callback("Pass", game.game._id);
        } else {
            callback("User already added.", user._id);
            return;
        }

        socket.join(pin);
        let player = game.players.find((player) => player._id === user._id);
        io.to(pin).emit("addedPlayer", player);
    });

    socket.on("startGame", (pin) => {
        if (activeGames.get(pin)) {
            console.log("Game " + pin + " is started");
            io.to(pin).emit("redirectPlayers", activeGames.get(pin).game._id);
        }
    });

    // Signal that host sends. Starts the countdown before the questions shows
    socket.on("questionCountdown", (pin, callback) => {
        callback();
        socket.to(pin).emit("questionCountdownFromHost");
    });

    // Signal that host sends. Starts the countdown during the questions
    socket.on("questionCountdownForPlayer", (pin, time, question) => {
        socket.to(pin).emit("questionCountdownForPlayerFromHost", time, question);
    })

    socket.on("gameOver", (pin) => {
        if (activeGames.get(pin)) {
            io.to(pin).emit("gameOverFromHost");
            activeGames.delete(pin);
        }
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
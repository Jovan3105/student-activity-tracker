const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

let game;
let players = [];

io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    socket.on("setupGame", (newGame) => {
        socket.join(newGame.pin);
        console.log("Host: " + socket.id + " Game: " + newGame.pin);
        game = newGame;
    });

    socket.on("addPlayer", (user, pin, error) => {
        //console.log(typeof (game.pin), typeof (pin));
        if (game.pin == pin) {

            if (!players.some((player) => player._id === user._id)) {
                players.push({ name: user.name, _id: user._id });
            }
            else {
                error('User already added.');
                return;
            }

            console.log(players)
            //console.log("addPlayer true")
            socket.join(game.pin);
            let player = players.find((player) => player._id === user._id);
            io.emit("addedPlayer", player);
        } else {
            error('No matching pin.');
        }
    });

    socket.on("startGame", () => {
        console.log("Game " + game.pin + " is started");
        socket.to(game.pin).emit("redirectPlayers", game._id);
    })

});

io.listen(3000);
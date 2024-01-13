const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

let game;
let players = [];

io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    socket.on("startGame", (newGame) => {
        socket.join(newGame.pin);
        console.log("Host: " + socket.id + " Game: " + newGame.pin);
        game = newGame;
    });

    socket.on("addPlayer", (user, pin) => {
        //console.log(typeof (game.pin), typeof (pin));
        if (game.pin == pin) {

            if (!players.some((player) => player._id === user._id)) {
                players.push({ name: user.name, _id: user._id });
            }
            else {
                console.log("User already added.");
                return;
            }

            console.log(players)
            //console.log("addPlayer true")
            socket.join(game.pin);
        } else {
            console.log("There is no corresponding pin.")
        }
    });

});

io.listen(3000);
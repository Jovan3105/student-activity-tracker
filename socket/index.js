const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

let game;

io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    socket.on("startGame", (newGame) => {
        socket.join(newGame.pin);
        console.log("Host: " + socket.id + " Game: " + newGame.pin)
    });

});

io.listen(3000);
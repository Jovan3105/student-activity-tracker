const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const quizRoute = require("./Routes/quizRoute");
const gameRoute = require("./Routes/gameRoute");
const playerGameplayRoute = require("./Routes/playerGameplayRoute");
const scoreboardRoute = require("./Routes/scoreboardRoute");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/quizes", quizRoute);
app.use("/api/games", gameRoute);
app.use("/api/playerGameplays", playerGameplayRoute);
app.use("/api/scoreboards", scoreboardRoute);

const port = process.env.PORT || 5000;
const connectionString = process.env.DATABASE_URL + "/" + process.env.DATABASE_NAME;

app.get("/", (req, res) => {
    res.send("Welcome to our chat APIs..")
});

app.listen(port, (req, res) => {
    console.log(`Server running on port: ${port}`)
    console.log(connectionString)
});

mongoose.connect(connectionString).then(() => console.log("MongoDB connection established")).catch((error) => console.log("MongoDB connection failed: ", error.message))
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);

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
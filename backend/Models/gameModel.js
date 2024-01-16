const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    pin: { type: Number },
    isActive: { type: Boolean, default: false },
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    playerGameplays: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PlayerGameplay",
        },
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model("Game", gameSchema);
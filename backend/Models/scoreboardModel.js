const mongoose = require("mongoose")

const scoreaboardSchema = new mongoose.Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    playerGameplays: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PlayerGameplay"
        }
    ],
    currentScoreboard: [
        {
            questionIndex: { type: Number },
            scoreboardList: [
                {
                    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                    currentScore: { type: Number }
                }
            ]
        }
    ]
})

module.exports = mongoose.model("Scoreboard", scoreaboardSchema);
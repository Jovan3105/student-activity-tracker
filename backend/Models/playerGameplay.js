const mongoose = require("mongoose");

const playerGameplaySchema = new mongoose.Schema({
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    score: { type: Number, default: 0 },
    questionList: [
        {
            questionIndex: { type: Number },
            answered: { type: Boolean, default: false },
            answer: { name: { type: String }, body: { type: String } },
            time: { type: Number },
            points: { type: Number, default: 0 }
        }
    ]
},{
    timestamps: true
});

module.exports = mongoose.model("PlayerGameplay", playerGameplaySchema);
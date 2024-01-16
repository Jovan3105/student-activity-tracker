const mongoose = require("mongoose")
const PlayerGameplay = require("../Models/playerGameplay");

const createPlayerGameplay = async (req, res) => {

    const { playerId, gameId, score, answers } = req.body;

    const playerGameplay = new PlayerGameplay(
        {
            playerId,
            gameId,
            score,
            answers
        }
    )

    try {
        await playerGameplay.save();
        res.status(200).json(playerGameplay)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getPlayerGameplays = async (req, res) => {
    try {
        const response = await PlayerGameplay.find();
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getPlayerGameplay = async (req, res) => {
    const PlayerGameplayId = req.params.id;
    try {
        const playerGameplay = await PlayerGameplay.findById(PlayerGameplayId);

        if (playerGameplay == null) {
            return res.status(400).json("Player Gameplay not found.")
        }

        res.status(200).json(playerGameplay);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = { createPlayerGameplay, getPlayerGameplays, getPlayerGameplay };
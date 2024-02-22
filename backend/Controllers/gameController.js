const mongoose = require("mongoose");
const Game = require("../Models/gameModel");

const createGame = async (req, res) => {

    const { hostId, quizId, pin, isActive, players, playerGameplays } = req.body

    const game = new Game(
        {
            hostId,
            quizId,
            pin,
            isActive,
            players,
            playerGameplays
        }
    )

    try {
        await game.save();
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getGames = async (req, res) => {
    try {
        const response = await Game.find();
        res.status(200).send(response);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getGame = async (req, res) => {
    const gameId = req.params.id;
    try {
        const game = await Game.findById(gameId);

        if (game == null) {
            return res.status(400).json("Game not found.");
        }

        res.status(200).json(game);
    } catch (error) {
        res.status(500).json(error);
    }
}

const addPlayer = async (req, res) => {
    const { gameId } = req.params;
    const { playerId } = req.body;

    //console.log(gameId, playerId);

    try {
        const game = await Game.findById(gameId);
        game.players.push(playerId);
        const updatedGame = await game.save();
        res.status(200).send(updatedGame);
    } catch (error) {
        res.status(500).json(error);
    }
}

const addResult = async (req, res) => {
    const { gameId } = req.params;
    const { excelData } = req.body;

    try {
        const game = await Game.findById(gameId);

        if (game == null) {
            return res.status(400).json("Game not found.");
        }

        excelData.forEach(element => {
            game.results.push(element);
        });

        await game.save();
        res.status(200).send(game);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getGamesByQuizId = async (req, res) => {
    const quizId = req.params.quizId;
    try {
        const games = await Game.find({ quizId });

        if (!games) {
            return res.status(400).json("No games found for the given quizId");
        }

        res.status(200).json(games);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = { createGame, getGames, getGame, addPlayer, addResult, getGamesByQuizId };
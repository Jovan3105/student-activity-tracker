const mongoose = require("mongoose")
const Scoreboard = require("../Models/scoreboardModel");
const Game = require("../Models/gameModel");
const Quiz = require("../Models/quizModel");

const createScoreboard = async (req, res) => {
    const { gameId, playerGameplays } = req.body;

    let game = await Game.findById(gameId);
    let quiz = await Quiz.findById(game.quizId);

    const scoreboard = new Scoreboard(
        {
            gameId,
            playerGameplays
        }
    )

    quiz.questionList.forEach((question) => {
        scoreboard.currentScoreboard.push({
            questionIndex: question.questionIndex,
            scoreboardList: []
        })
    })

    try {
        await scoreboard.save()
        res.status(200).json(scoreboard);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getScoreboard = async (req, res) => {
    const scoreboardId = req.params.id;
    try {
        const scoreboard = await Scoreboard.findById(scoreboardId);

        if (scoreboard == null) {
            return res.status(400).json("Scoreboard not found.")
        }

        res.status(200).json(scoreboard);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = { createScoreboard, getScoreboard }
const mongoose = require("mongoose")
const PlayerGameplay = require("../Models/playerGameplay");
const Game = require("../Models/gameModel");
const Quiz = require("../Models/quizModel");

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

const addAnswer = async (req, res) => {
    const PlayerGameplayId = req.params.playerResultId;
    const { questionIndex, answer, time } = req.body;

    try {
        const playerGameplay = await PlayerGameplay.findById(PlayerGameplayId);
        const game = await Game.findById(playerGameplay.gameId);
        const quiz = await Quiz.findById(game.quizId);
        let answered = false;

        const correctAnswers = quiz.questionList[questionIndex - 1].answerList.filter((answer) => answer.isCorrect).map((answer) => answer.name);
        //console.log("correct answers ", correctAnswers);
        let points = 0;
        // if name of the answer is correct
        const correctCount = correctAnswers.filter((ans) => ans === answer.name).length;

        // Update player result
        if (correctCount === correctAnswers.length) {
            playerGameplay.score++;
            points++;
            answered = true;
        }
        playerGameplay.questionList.push(
            {
                questionIndex,
                answered,
                answer,
                time,
                points
            }
        );

        const updatedPlayerResult = await playerGameplay.save();
        res.status(200).json(updatedPlayerResult);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports = { createPlayerGameplay, getPlayerGameplays, getPlayerGameplay, addAnswer };
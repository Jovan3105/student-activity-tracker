const mongoose = require("mongoose")
const Quiz = require("../Models/quizModel");

const createQuiz = async (req, res) => {

    const { name, description, backgroundImage, creatorId, pointsPerQuestion, questionList } = req.body;

    const quiz = new Quiz(
        {
            name,
            description,
            backgroundImage,
            creatorId,
            //creatorName,
            pointsPerQuestion,
            numberOfQuestions: questionList.length,
            questionList
        }
    )

    try {
        await quiz.save();
        res.status(200).json(quiz);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getQuizes = async (req, res) => {
    try {
        const response = await Quiz.find();
        res.status(200).send(response);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getQuiz = async (req, res) => {
    const quizId = req.params.id;
    try {
        const quiz = await Quiz.findById(quizId);

        if (quiz == null) {
            return res.status(400).json("Quiz not found.")
        }

        res.status(200).json(quiz)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = { createQuiz, getQuiz, getQuizes };
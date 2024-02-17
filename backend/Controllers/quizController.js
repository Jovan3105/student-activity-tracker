const mongoose = require("mongoose")
const Quiz = require("../Models/quizModel");
const Subject = require("../Models/subjectModel");

const createQuiz = async (req, res) => {

    const { name, description, backgroundImage, creatorId, creatorName, pointsPerQuestion, questionList, subjectId } = req.body;

    const quiz = new Quiz(
        {
            name,
            description,
            backgroundImage,
            creatorId,
            creatorName,
            pointsPerQuestion,
            numberOfQuestions: questionList.length,
            questionList,
            subjectId
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

const deleteQuiz = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send(`No quiz with id: ${id}`)
    }

    try {
        await Quiz.findOneAndDelete({ _id: id })
        res.json("Quiz deleted succesfully")
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateQuiz = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No quiz with id: ${id}`)
    }

    const { name, description, backgroundImage, questionList } = req.body;

    const quiz = new Quiz(
        {
            _id: id,
            name,
            backgroundImage,
            description,
            numberOfQuestions: questionList.length,
            questionList
        }
    )

    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(id, quiz)
        res.json(updatedQuiz)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getQuizesBySubjectId = async (req, res) => {
    const { id } = req.params;
    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send(`No subject with id: ${id}`)
        }
        // to-do: find personal quizes
        const response = await Quiz.find({ subjectId: id });

        res.status(200).send(response);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { createQuiz, getQuiz, getQuizes, deleteQuiz, updateQuiz, getQuizesBySubjectId };
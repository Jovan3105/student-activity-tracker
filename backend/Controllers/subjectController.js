const mongoose = require("mongoose");
const Subject = require("../Models/subjectModel");
const Quiz = require("../Models/quizModel");
const Game = require("../Models/gameModel");

const createSubject = async (req, res) => {

    const { name, year, semester, backgroundImage, creatorId } = req.body;

    const subject = new Subject(
        {
            name,
            year,
            semester,
            backgroundImage,
            creatorId
        }
    )

    try {
        await subject.save();
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getSubjects = async (req, res) => {
    try {
        const response = await Subject.find().populate("studentList");
        res.status(200).send(response);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getSubject = async (req, res) => {
    const subjectId = req.params.id;
    try {
        const subject = await Subject.findById(subjectId);

        if (subject == null) {
            return res.status(400).json("Subject not found.");
        }

        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteSubject = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send(`No subject with id: ${id}`)
    }

    try {
        await Subject.findOneAndDelete({ _id: id })
        res.json("Subject deleted succesfully")
    } catch (error) {
        res.status(500).json(error)
    }
}

const getAvailableSubjects = async (req, res) => {
    const userId = req.params.userId;

    try {
        const subjects = await Subject.find(
            {
                studentList: {
                    $nin: [userId]
                }
            }
        );

        res.status(200).json(subjects)
    } catch (error) {
        res.status(500).json(error);
    }
}

const getSubscribedSubjectsByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const subjects = await Subject.find({ studentList: userId });

        res.status(200).json(subjects)
    } catch (error) {
        res.status(500).json(error);
    }
}

const subscribeToSubject = async (req, res) => {
    const subjectId = req.params.subjectId;
    const userId = req.params.userId;

    try {
        const subject = await Subject.findById(subjectId);

        if (subject == null) {
            return res.status(400).json("Subject not found.");
        }

        let student = subject.studentList.find((student) => student._id === userId);

        if (student) {
            return res.status(400).json("Already subscribed.");
        }

        subject.studentList.push(userId);

        await subject.save();

        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json(error);
    }
}

const unsubscribeToSubject = async (req, res) => {
    const subjectId = req.params.subjectId;
    const userId = req.params.userId;

    try {
        const subject = await Subject.findById(subjectId);

        if (subject == null) {
            return res.status(400).json("Subject not found.");
        }

        subject.studentList = subject.studentList.filter(studentId => studentId.toString() !== userId);

        await subject.save();

        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getSubjectByQuizId = async (req, res) => {
    const quizId = req.params.quizId;
    try {
        const quiz = await Quiz.findById(quizId);
        const subject = await Subject.findById(quiz.subjectId);

        if (!subject) {
            return res.status(400).json("Subject not found with that quiz.");
        }

        res.status(200).json(subject);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const compareYearlyResults = async (req, res) => {
    const subjectName = req.body.subjectName;
    try {
        const subjects = await Subject.find({ name: subjectName });
        //console.log(subjects)
        const yearlyResults = [];


        const calculateMeanScore = (results) => {
            if (results.length === 0) {
                return 0;
            }

            const totalScore = results.reduce((sum, result) => sum + result.score, 0);
            return totalScore / results.length;
        };

        for (let i = 0; i < subjects.length; i++) {
            const subject = subjects[i];
            const quizes = await Quiz.find({ subjectId: subject._id });
            let highestMeanScore = 0;
            for (let j = 0; j < quizes.length; j++) {
                const quiz = quizes[j];
                const games = await Game.find({ quizId: quiz._id });
                if (games.length === 0) {
                    continue;
                }
                for (let k = 0; k < games.length; k++) {
                    const game = games[k];
                    const meanScore = calculateMeanScore(game.results);

                    if (meanScore > highestMeanScore) {
                        highestMeanScore = meanScore;
                    }
                }
            }
            yearlyResults.push({ year: subject.year, averageScore: highestMeanScore });
        }

        res.status(200).json(yearlyResults);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getSubjectsByCreatorId = async (req, res) => {
    const creatorId = req.params.creatorId;

    try {
        const response = await Subject.find({ creatorId: creatorId }).populate("studentList");
        res.status(200).send(response);
    } catch (error) {
        res.status(500).json(error);
    }
}






module.exports = { createSubject, getSubject, getSubjects, deleteSubject, getAvailableSubjects, getSubscribedSubjectsByUser, subscribeToSubject, unsubscribeToSubject, getSubjectByQuizId, compareYearlyResults, getSubjectsByCreatorId };
const mongoose = require("mongoose")

const quizSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    backgroundImage: { type: String },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    creatorName: { type: String },
    pointsPerQuestion: { type: Number, min: 1 },
    numberOfQuestions: { type: Number, default: 0 },
    questionList: [
        {
            questionIndex: { type: Number, required: true },
            question: { type: String, required: true },
            // 0 - true/false, 1 - standard quiz
            questionType: { type: Number, required: true },
            // in seconds
            answerTime: { type: Number, min: 5, max: 90 },
            backgroundImage: { type: String },
            answerList: [
                {
                    name: { type: String },
                    body: { type: String },
                    isCorrect: { type: Boolean }
                },
            ]
        },
    ],
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" }
}, {
    timestamps: true
});

module.exports = mongoose.model("Quiz", quizSchema)

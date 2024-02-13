const mongoose = require("mongoose");
const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlenght: 30 },
    year: { type: Date, required: true },
    semester: { type: String, required: true },
    gameList: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Game" }
    ],
    studentList: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model("Subject", subjectSchema);
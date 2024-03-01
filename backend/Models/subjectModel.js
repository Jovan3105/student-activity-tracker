const mongoose = require("mongoose");
const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlenght: 30 },
    year: { type: String, required: true },
    semester: { type: String, required: true },
    backgroundImage: { type: String },
    gameList: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Game" }
    ],
    studentList: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, {
    timestamps: true
});

subjectSchema.index({ studentList: 1 });

module.exports = mongoose.model("Subject", subjectSchema);
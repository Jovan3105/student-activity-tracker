const express = require("express");
const { createQuiz, getQuizes, getQuiz, deleteQuiz, updateQuiz } = require("../Controllers/quizController");

const router = express.Router();

router.post("/", createQuiz);
router.get("/", getQuizes);
router.get("/:id", getQuiz);
router.delete("/:id", deleteQuiz);
router.patch("/:id", updateQuiz);

module.exports = router;

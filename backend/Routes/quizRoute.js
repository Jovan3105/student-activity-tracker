const express = require("express");
const { createQuiz, getQuizes, getQuiz } = require("../Controllers/quizController");

const router = express.Router();

router.post("/", createQuiz);
router.get("/", getQuizes);
router.get("/:id", getQuiz);

module.exports = router;

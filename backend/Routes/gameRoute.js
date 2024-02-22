const express = require("express");
const { createGame, getGames, getGame, addPlayer, addResult, getGamesByQuizId } = require("../Controllers/gameController");

const router = express.Router();

router.post("/", createGame);
router.get("/", getGames);
router.get("/:id", getGame);
router.get("/:quizId/games", getGamesByQuizId);
router.patch("/:gameId/players", addPlayer);
router.patch("/:gameId/results", addResult);

module.exports = router;

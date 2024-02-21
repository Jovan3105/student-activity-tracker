const express = require("express");
const { createGame, getGames, getGame, addPlayer, addResult } = require("../Controllers/gameController");

const router = express.Router();

router.post("/", createGame);
router.get("/", getGames);
router.get("/:id", getGame);
router.patch("/:gameId/players", addPlayer);
router.patch("/:gameId/results", addResult);

module.exports = router;

const express = require("express");
const { createGame, getGames, getGame, addPlayer } = require("../Controllers/gameController");

const router = express.Router();

router.post("/", createGame);
router.get("/", getGames);
router.get("/:id", getGame);
router.patch("/:gameId/players", addPlayer);

module.exports = router;

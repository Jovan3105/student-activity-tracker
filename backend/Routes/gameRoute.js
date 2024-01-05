const express = require("express");
const { createGame, getGames, getGame } = require("../Controllers/gameController");

const router = express.Router();

router.post("/", createGame);
router.get("/", getGames);
router.get("/:id", getGame);

module.exports = router;

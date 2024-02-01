const express = require("express");
const { createPlayerGameplay, getPlayerGameplays, getPlayerGameplay, addAnswer, getPlayerGameplayByUserAndGame, getPlayerGameplaysByGame } = require("../Controllers/playerGameplayController");

const router = express.Router();

router.post("/", createPlayerGameplay);
router.get("/", getPlayerGameplays);
router.get("/:id", getPlayerGameplay);
router.patch("/:playerResultId/answers", addAnswer);
router.get("/:gameId/players", getPlayerGameplaysByGame);
router.get("/:gameId/:playerId", getPlayerGameplayByUserAndGame);

module.exports = router;
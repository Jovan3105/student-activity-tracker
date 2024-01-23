const express = require("express");
const { createPlayerGameplay, getPlayerGameplays, getPlayerGameplay, addAnswer } = require("../Controllers/playerGameplayController");

const router = express.Router();

router.post("/", createPlayerGameplay);
router.get("/", getPlayerGameplays);
router.get("/:id", getPlayerGameplay);
router.patch("/:playerResultId/answers", addAnswer);

module.exports = router;
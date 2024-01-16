const express = require("express");
const { createPlayerGameplay, getPlayerGameplays, getPlayerGameplay } = require("../Controllers/playerGameplayController");

const router = express.Router();

router.post("/", createPlayerGameplay);
router.get("/", getPlayerGameplays);
router.get("/:id", getPlayerGameplay);

module.exports = router;
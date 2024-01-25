const express = require("express");
const { createScoreboard, getScoreboard } = require("../Controllers/scoreboardController");

const router = express.Router();

router.post("/", createScoreboard);
router.get("/:id", getScoreboard);

module.exports = router;
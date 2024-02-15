const express = require("express");
const { createSubject, getSubject, getSubjects } = require("../Controllers/subjectController");

const router = express.Router();

router.post("/", createSubject);
router.get("/", getSubjects);
router.get("/:id", getSubject);

module.exports = router;
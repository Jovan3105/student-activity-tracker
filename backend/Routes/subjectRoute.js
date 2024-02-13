const express = require("express");
const { createSubject, getSubject, getSubjects } = require("../Controllers/subjectController");

const router = express.Router();

router.post("/", createSubject);
router.get("/", getSubject);
router.get("/:id", getSubjects);

module.exports = router;
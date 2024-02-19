const express = require("express");
const { createSubject, getSubject, getSubjects, deleteSubject, getAvailableSubjects } = require("../Controllers/subjectController");

const router = express.Router();

router.post("/", createSubject);
router.get("/", getSubjects);
router.get("/:id", getSubject);
router.get("/available/:userId", getAvailableSubjects);
router.delete("/:id", deleteSubject);

module.exports = router;
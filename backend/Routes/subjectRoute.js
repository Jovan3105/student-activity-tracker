const express = require("express");
const { createSubject, getSubject, getSubjects, deleteSubject } = require("../Controllers/subjectController");

const router = express.Router();

router.post("/", createSubject);
router.get("/", getSubjects);
router.get("/:id", getSubject);
router.delete("/:id", deleteSubject);

module.exports = router;
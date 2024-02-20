const express = require("express");
const { createSubject, getSubject, getSubjects, deleteSubject, getAvailableSubjects, getSubscribedSubjectsByUser, subscribeToSubject, unsubscribeToSubject } = require("../Controllers/subjectController");

const router = express.Router();

router.post("/", createSubject);
router.get("/", getSubjects);
router.get("/:id", getSubject);
router.get("/available/:userId", getAvailableSubjects);
router.get("/subscribed/:userId", getSubscribedSubjectsByUser);
router.post("/subscribe/:subjectId/:userId", subscribeToSubject);
router.delete("/:id", deleteSubject);
router.delete("/unsubscribe/:subjectId/:userId", unsubscribeToSubject);

module.exports = router;
const express = require("express");
const { createSubject, getSubject, getSubjects, deleteSubject, getAvailableSubjects, getSubscribedSubjectsByUser, subscribeToSubject, unsubscribeToSubject, getSubjectByQuizId, compareYearlyResults, getSubjectsByCreatorId } = require("../Controllers/subjectController");

const router = express.Router();

router.post("/", createSubject);
router.get("/", getSubjects);
router.get("/:id", getSubject);
router.get("/byCreator/:creatorId", getSubjectsByCreatorId);
router.get("/available/:userId", getAvailableSubjects);
router.get("/subscribed/:userId", getSubscribedSubjectsByUser);
router.get("/subject/:quizId", getSubjectByQuizId);
router.post("/subscribe/:subjectId/:userId", subscribeToSubject);
router.post("/compareYearlyResults", compareYearlyResults);
router.delete("/:id", deleteSubject);
router.delete("/unsubscribe/:subjectId/:userId", unsubscribeToSubject);

module.exports = router;
const mongoose = require("mongoose");
const Subject = require("../Models/subjectModel");

const createSubject = async (req, res) => {

    const { name, year, semester, backgroundImage } = req.body;

    const subject = new Subject(
        {
            name,
            year,
            semester,
            backgroundImage
        }
    )

    try {
        await subject.save();
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getSubjects = async (req, res) => {
    try {
        const response = await Subject.find().populate("studentList");
        res.status(200).send(response);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getSubject = async (req, res) => {
    const subjectId = req.params.id;
    try {
        const subject = await Subject.findById(subjectId);

        if (subject == null) {
            return res.status(400).json("Subject not found.");
        }

        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteSubject = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send(`No subject with id: ${id}`)
    }

    try {
        await Subject.findOneAndDelete({ _id: id })
        res.json("Subject deleted succesfully")
    } catch (error) {
        res.status(500).json(error)
    }
}

const getAvailableSubjects = async (req, res) => {
    const userId = req.params.userId;

    try {
        const subjects = await Subject.find(
            {
                studentList: {
                    $nin: [userId]
                }
            }
        );

        res.status(200).json(subjects)
    } catch (error) {
        res.status(500).json(error);
    }
}

const getSubscribedSubjectsByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const subjects = await Subject.find({ studentList: userId });

        res.status(200).json(subjects)
    } catch (error) {
        res.status(500).json(error);
    }
}

const subscribeToSubject = async (req, res) => {
    const subjectId = req.params.subjectId;
    const userId = req.params.userId;

    try {
        const subject = await Subject.findById(subjectId);

        if (subject == null) {
            return res.status(400).json("Subject not found.");
        }

        let student = subject.studentList.find((student) => student._id === userId);

        if (student) {
            return res.status(400).json("Already subscribed.");
        }

        subject.studentList.push(userId);

        await subject.save();

        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json(error);
    }
}

const unsubscribeToSubject = async (req, res) => {
    const subjectId = req.params.subjectId;
    const userId = req.params.userId;

    try {
        const subject = await Subject.findById(subjectId);

        if (subject == null) {
            return res.status(400).json("Subject not found.");
        }

        subject.studentList = subject.studentList.filter(studentId => studentId.toString() !== userId);

        await subject.save();

        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json(error);
    }
}





module.exports = { createSubject, getSubject, getSubjects, deleteSubject, getAvailableSubjects, getSubscribedSubjectsByUser, subscribeToSubject, unsubscribeToSubject };
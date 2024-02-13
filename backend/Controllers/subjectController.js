const mongoose = require("mongoose");
const Subject = require("../Models/subjectModel");

const createSubject = async (req, res) => {

    const { name, year, semester } = req.body;

    const subject = new Subject(
        {
            name,
            year,
            semester
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
        const response = await Subject.find();
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



module.exports = { createSubject, getSubject, getSubjects };
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



module.exports = { createSubject, getSubject, getSubjects, deleteSubject };
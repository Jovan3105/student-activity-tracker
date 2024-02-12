const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;

    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await userModel.findOne({ email });

        if (user) {
            return res.status(400).json("User with given email already exists.");
        }

        if (!name || !email || !password) {
            return res.status(400).json("All fields are required.");
        }

        const nameRegex = /^[A-Za-z]{1,10}\.[A-Za-z]{1,13}$/;
        if (!nameRegex.test(name)) {
            return res.status(400).json("Name is not in a valid IMI format.");
        }

        const customEmailRegex = /^\d{0,3}-\d{0,4}@pmf\.kg\.ac\.rs$/;
        if (!customEmailRegex.test(email)) {
            return res.status(400).json("Email is not in a valid IMI format.");
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json("Password is not strong enough.");
        }

        const confirmationCode = Math.floor(100000 + Math.random() * 900000);

        user = new userModel({ name, email, password, role, confirmationCode, isConfirmed: false });

        sendConfirmationCode(email, confirmationCode);

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();


        //res.status(200).json();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

};

const sendConfirmationCode = async (email, code) => {
    // Implement logic to send the confirmation code via email
    // You can use a library like Nodemailer to send emails

    // Example Nodemailer usage (replace with your own email sending logic)
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        // Configure your email transport options (SMTP, etc.)
        // Example using a Gmail SMTP server:
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Confirmation Code',
        text: `Your confirmation code is: ${code}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending confirmation code:', error);
        } else {
            console.log('Confirmation code sent:', info.response);
        }
    });
};
const confirmAccount = async (req, res) => {
    try {
        const { confirmationCode } = req.body;

        const user = await userModel.findOne(
            {
                confirmationCode,
                isConfirmed: false
            }
        );

        if (!user) {
            return res.status(400).json({ error: "User not found or already confirmed." });
        }

        user.isConfirmed = true;
        await user.save();

        res.status(200).json({ pass: "Account confirmed successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error.");
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json("Invalid email or password.");
        }
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json("Invalid email or password.");
        }

        if (user.isConfirmed === false) {
            return res.status(400).json("User is not confirmed.")
        }

        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, name: user.name, email, role: user.role, token });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

};

const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);

        res.status(200).json({ user });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();

        res.status(200).json({ users });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = { registerUser, loginUser, findUser, getUsers, confirmAccount };
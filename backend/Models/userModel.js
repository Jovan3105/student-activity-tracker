const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlenght: 30 },
    email: { type: String, required: true, minlength: 3, maxlenght: 200, unique: true },
    password: { type: String, required: true, minlength: 3, maxlenght: 1024 },
    // 0 professor, 1 student
    role: { type: Number },
    confirmationCode: { type: Number },
    isConfirmed: { type: Boolean }
}, {
    timestamps: true
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
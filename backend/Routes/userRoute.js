const express = require("express");
const { registerUser, loginUser, findUser, getUsers, confirmAccount } = require("../Controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.patch("/register/confirm", confirmAccount);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);


module.exports = router;
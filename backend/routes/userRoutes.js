const express = require("express");

//controller functions
const { loginUser, registerUser } = require("../controllers/userController");

const router = express.Router();

//login
router.post("/login", loginUser);

//register
router.post("/register", registerUser);

module.exports = router;

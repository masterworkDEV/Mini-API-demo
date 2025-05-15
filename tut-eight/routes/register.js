const express = require("express");
const router = express.Router();
const { createNewUser } = require("../controllers/registerController");

// post and the use it in our server.js file
router.post("/", createNewUser);

module.exports = router;

const express = require("express");
const router = express();
const handleRefreshToken = require("../controllers/refreshTokenController");

router.get("/", handleRefreshToken);
module.exports = router;

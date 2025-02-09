const express = require("express");
const multer = require("multer");
const fs = require("fs");
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");

// router object
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Grooup API running..");
});

module.exports = router;

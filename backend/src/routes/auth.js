const express = require("express");
const router = express.Router();
const { loginUser, registerUser, logoutUser, getCurrentUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/register", registerUser);
router.get("/me", protect, getCurrentUser);

module.exports = router;

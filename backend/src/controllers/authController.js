const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401);
            throw new Error("Invalid email or password");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401);
            throw new Error("Invalid email or password");
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        // Set the token as HTTP-only secure cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in prod for HTTPS only
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // lax for development
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? undefined : undefined // undefined for localhost
        });

        // Respond with user info only (no token)
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Login Error:", err);
        throw err;
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? undefined : undefined
    });
    res.json({ message: "Logged out successfully" });
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please provide name, email and password");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "manager",
    });

    if (user) {
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

const getCurrentUser = asyncHandler(async (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        },
    });
});

module.exports = { loginUser, registerUser, logoutUser, getCurrentUser };

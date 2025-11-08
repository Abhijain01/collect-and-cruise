import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = express.Router();
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
// Register user
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ email, password });
    if (user) {
        res.status(201).json({
            _id: user._id.toString(), // ✅ fixed
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id.toString()), // ✅ fixed
        });
    }
    else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});
// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id.toString(), // ✅ fixed
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id.toString()), // ✅ fixed
        });
    }
    else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});
export default router;

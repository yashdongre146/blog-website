const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('auth');
        if (!token) {
            return res.status(401).json({ error: "Authorization token missing." });
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decodedUser.id);

        if (!user) {
            return res.status(401).json({ error: "User not found." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: "Invalid token." });
    }
}

module.exports = {auth}
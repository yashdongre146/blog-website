const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

function generateToken(id, name, email, password){
    return jwt.sign({id, name, email, password}, process.env.JWT_SECRET)
}

exports.signup = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        // Check if all required fields are present
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please provide username, email, password.'});
        }

        const hash = await bcryptjs.hash(password, 10);
        const user = await User.create({name, email, password: hash})
        res.status(201).json({ message: 'Signup successful!', userId: user.id });
    } catch (error) {
        // Check for unique constraint violation (duplicate email)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Email address is already in use.' });
        }else{
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password.' });
        }

        const user = await User.findOne({where: {email : email}})
        if (user) {
                const passwordMatch = await bcryptjs.compare(password, user.password);
                if (passwordMatch) {
                    res.json({ token: generateToken(user.id, user.name, user.email, user.password) });
                } else {
                    res.status(422).json({ error: 'Password does not match.' });
                }
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong.' });
    }
}
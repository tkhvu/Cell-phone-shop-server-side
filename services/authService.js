const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const authenticateUser = async ({ username, password }) => {
    const user = await User.findOne({ username });
    if (!user) return null;

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return null;

    return user;
};

const TokenCheck = (token) => {
    try {
        const result = jwt.verify(token, process.env.JWT_SECRET);
        return result;
    } catch (e) {
        return false;
    }
};

module.exports = {
    authenticateUser,
    TokenCheck,
};

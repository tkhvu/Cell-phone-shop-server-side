const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');
const Cart = require('../models/Cart');




const localStorage = async (_id) => {

    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(_id) });

    if (user) {
        return user;
    } else {
        return null;
    }
};

 const authenticateUser = async ({ username, password }) => {
    const user = await User.findOne({ username: username });
    if (!user) return null;

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return null;

    return user; 
};


const addUser = async (firstname, lastname, email, username, hashedPwd) => {
    try {
        const newCart = await new Cart({ cart: [] }).save();
        const cartId = newCart._id;

        const newUser = new User({
            firstname,
            lastname,
            email,
            username,
            password: hashedPwd,
            favorites: [],
            cart: cartId,
            Director: false
        });

        return newUser.save();
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};


const UserameCheck = async (username) => {

    return await User.findOne({ username: username });

};
const UsersDetails = async () => {
    return await User.find();
};

module.exports = {
    addUser,
    authenticateUser,
    localStorage,
    UsersDetails,
    UserameCheck
};

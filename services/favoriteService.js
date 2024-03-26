const mongoose = require('mongoose');
const User = require('../models/User');



const addToFavorites = async ({_id, id}) => {

    await User.updateOne({ _id: new mongoose.Types.ObjectId(_id) }, { $push: { favorites: new mongoose.Types.ObjectId(id) } });
};

const deleteFavorites = async (_id, id) => {

    await User.updateOne({ _id: new mongoose.Types.ObjectId(_id) }, { $pull: { favorites: new mongoose.Types.ObjectId(id) } });

};

module.exports = {
    addToFavorites,
    deleteFavorites,
};

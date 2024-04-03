const Category = require('../models/Category');
const mongoose = require('mongoose');





const getCategory = async () => {
    return await Category.find({});
};

const deleteCategory = async (_id) => {
    return await Category.deleteOne({ "_id": new mongoose.Types.ObjectId(_id) });
};

const categoryUpdate = async ({_id, category}) => {
 
    if (_id.length < 11) {
        const newCategory = new Category({
            category: category
        });
        return await newCategory.save();


    } else {
        return await Category.updateOne(
            { "_id": new mongoose.Types.ObjectId(_id) },
            { $set: { category } }
        );
    }
};

module.exports = {
    getCategory,
    deleteCategory,
    categoryUpdate,
};

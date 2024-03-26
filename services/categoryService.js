const Category = require('../models/Category');
const mongoose = require('mongoose');


// getCategory: async () => {
//     const result = await Category.find();

//     return result;
// },


// deleteCategory: async (_id) => {
//     const result = await Category.deleteOne({ "_id": new mongoose.Types.ObjectId(_id) });

//     return result;
// },

// categoryUpdate: async ({_id, category}) => {

//     if (_id.length < 11) {
//         const newCategory = new Category({
//             category: category
//         });
//         const result = await newCategory.save();
//         return result;

//     } else {
//         const result = await Category.updateOne({ "_id": new mongoose.Types.ObjectId(_id) },
//             { $set: { category: category } });
//         return result;
//     }
// },


const getCategory = async () => {
    return await Category.find({});
};

const deleteCategory = async (_id) => {
    return await Category.deleteOne({ "_id": new mongoose.Types.ObjectId(_id) });
};

const categoryUpdate = async ({_id, category}) => {
    // if (_id && _id.length < 11) { // Check on condition, seems off due to _id length check
    //     const newCategory = new Category({ category });
    //     return await newCategory.save();
    // } else {
    //     return await Category.updateOne(
    //         { "_id": new mongoose.Types.ObjectId(_id) }, 
    //         { $set: { category } }
    //     );
    // }
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

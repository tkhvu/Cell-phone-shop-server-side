const mongoose = require('mongoose');
const Product = require('../models/Product');

const addProduct = async ({ selectedFileBase64, name, priceNumber, category }) => {
    try {
        const newPhone = new Product({
            src: selectedFileBase64,
            name,
            price: priceNumber,
            category: new mongoose.Types.ObjectId(category)
        });
        return await newPhone.save();
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

const deleteProduct = async (_id) => {
    try {
        const result = await Product.deleteOne({ "_id": new mongoose.Types.ObjectId(_id) });
        return result;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

const ProductUpdate = async ({ _id, name, priceNumber }) => {
    try {
        const result = await Product.updateOne(
            { "_id": new mongoose.Types.ObjectId(_id) },
            { $set: { name, price: priceNumber } }
        );
        return result;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

const getMobile = async () => {
    try {
        return await Product.find({});
    } catch (error) {
        console.error('Error getting products:', error);
        throw error;
    }
};

module.exports = {
    addProduct,
    deleteProduct,
    ProductUpdate,
    getMobile,
};

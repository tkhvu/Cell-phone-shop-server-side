const Cart = require('../models/Cart');
const mongoose = require('mongoose');

const emptyCart = async (_id) => {
    const result = await Cart.updateOne({ "_id": new mongoose.Types.ObjectId(_id) },
        { $set: { cart: [] } })
    return result;
};


const cartDetails = async (_id) => {
    return await Cart.findOne({ _id: new mongoose.Types.ObjectId(_id) });
};


const addToCart = async (_id, id) => {
    const cartExists = await Cart.findOne({ _id, "cart._id": new mongoose.Types.ObjectId(id) });

    if (cartExists) {
        await Cart.updateOne(
            { _id: new mongoose.Types.ObjectId(_id), "cart._id": new mongoose.Types.ObjectId(id) },
            { $inc: { "cart.$.count": 1 } }
        );
    } else {
        await Cart.updateOne(
            { _id: _id },
            { $push: { cart: { _id: new mongoose.Types.ObjectId(id), count: 1 } } }
        );
    }
};


const findCartItemDetails = async (_id, id) => {
    const result = await Cart.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(_id) }
        },
        {
            $project: {
                cartIndex: {
                    $indexOfArray: ["$cart._id", new mongoose.Types.ObjectId(id)]
                },
                itemCount: { $arrayElemAt: ["$cart.count", { $indexOfArray: ["$cart._id", new mongoose.Types.ObjectId(id)] }] }
            }
        }
    ]);

    return result;
};


const deleteObjectcart = async (_id, cartIndex) => {
     await Cart.updateOne(
        { _id: new mongoose.Types.ObjectId(_id) },
        {
            $unset: { [`cart.${cartIndex}`]: 1 }
        }
    );
     await Cart.updateOne(
        { _id: new mongoose.Types.ObjectId(_id) },
        {
            $pull: { cart: null }
        }
    );

};






const aggregateProductDetails = async (_id) => {

    return await Cart.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(_id)},
        },
        {
          $lookup: {
            from: "phones",
            localField: "cart._id",
            foreignField: "_id",
            as: "cart",
          },
        },
      ]);
};





const cartUpdate = async (_id, id, count) => {
     await Cart.updateOne(
        { _id: new mongoose.Types.ObjectId(_id), "cart._id": new mongoose.Types.ObjectId(id) },
        {
            $set: { "cart.$.count": count }
        }
    );
};

module.exports = {
    emptyCart,
    cartDetails,
    addToCart,
    findCartItemDetails,
    cartUpdate,
    deleteObjectcart,
    aggregateProductDetails
};

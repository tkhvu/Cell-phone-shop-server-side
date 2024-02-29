require('dotenv').config({ path: "./config.env" });
const jwt = require('jsonwebtoken');
const { Cart, User, Phone, Category } = require('./userModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports = {

    getCategory: async () => {
        const result = await Category.find();

        return result;
    },


    deleteCategory: async (_id) => {
        const result = await Category.deleteOne({ "_id": new mongoose.Types.ObjectId(_id) });

        return result;
    },

    categoryUpdate: async (_id, category) => {
        if (_id.length < 11) {
            const newCategory = new Category({
                category: category
            });
            const result = await newCategory.save();
            return result;

        } else {
            const result = await Category.updateOne({ "_id": new mongoose.Types.ObjectId(_id) },
                { $set: { category: category } });
            return result;
        }
    },

    ProductUpdate: async (_id, name, priceNumber) => {
        const result = await Phone.updateOne({ "_id": new mongoose.Types.ObjectId(_id) },
            { $set: { name: name, price: priceNumber } });
        return result;
    },

    deleteProduct: async (_id) => {
        const result = await Phone.deleteOne({ "_id": new mongoose.Types.ObjectId(_id) });

        return result;
    },

    getMobile: async () => {
        const resultPhones = await Phone.find();

        return resultPhones;
    },

    getUsers: async () => {
        return await User.find();
    },


    addFavorites: async (_id, id) => {

        await User.updateOne({ _id: new mongoose.Types.ObjectId(_id) }, { $push: { favorites: new mongoose.Types.ObjectId(id) } });
    },



    addCart: async (_id, id) => {

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
    },


    emptyCart: async (_id) => {

        const result = await Cart.updateOne({ "_id": new mongoose.Types.ObjectId(_id) },
            { $set: { cart: [] } })
        return result;

    },


    addUser: async (firstname, lastname, email, username, hashedPwd) => {
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
                cart: cartId
            });

            return newUser.save();
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    },

    deleteFavorites: async (_id, id) => {

        await User.updateOne({ _id: new mongoose.Types.ObjectId(_id) }, { $pull: { favorites: new mongoose.Types.ObjectId(id) } });

    },

    localStorage: async (_id) => {

        const user = await User.findOne({ _id: new mongoose.Types.ObjectId(_id) });

        if (user) {
            return user;
        } else {
            return null;
        }
    },


    MobileDetails: async (_id) => {

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
    },

    getCart: async (_id) => {
        return await Cart.findOne({_id: new mongoose.Types.ObjectId(_id)});
    },

    deleteFromcart: async (_id, id) => {
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
    },


    deleteObjectcart: async (_id, cartIndex) => {
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

    },

    cartUpdate: async (_id, id, count) => {
         await Cart.updateOne(
            { _id: new mongoose.Types.ObjectId(_id), "cart._id": new mongoose.Types.ObjectId(id) },
            {
                $set: { "cart.$.count": count }
            }
        );
    },


    addProduct: async (selectedFileBase64, name, priceNumber, category) => {
        // const result = await Phone.insertOne({
        //     src: selectedFileBase64,
        //     name: name,
        //     price: priceNumber,
        //     category: new mongoose.Types.ObjectId(category)
        // });
        const newPhone = new Phone({
            src: selectedFileBase64,
            name: name,
            price: priceNumber,
            category: new mongoose.Types.ObjectId(category)
        });
        return await newPhone.save();
    },

//     addCategory: async (category) => {

//         const result = await Category.insertOne({ category: category });
// console.log(221)
//         return result;
//     },

    TokenCheck(cookie) {
        try {

            const result = jwt.verify(cookie, process.env.JWT_SECRET);
            return result;

        } catch (e) {
            return false;
        }
    },


    findUser: async (username) => {

        return await User.findOne({ username: username });

    },

     authenticateUser : async ({ username, password }) => {
        const user = await User.findOne({ username: username });
        if (!user) return null;
    
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;
    
        return user; 
    }
}

require('dotenv').config({ path: "./config.env" });
const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb+srv://" + process.env.USERNAME_PASSWORD + "@cluster0.92quexa.mongodb.net/");
const ObjectID = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const { Cart, User, Phone, Category } = require('./userModel');
const mongoose = require('mongoose');
// mongoose.connect("mongodb+srv://" + process.env.USERNAME_PASSWORD + "@cluster0.92quexa.mongodb.net/mobile");

module.exports = {

    getCategory: async () => {
        const result = await client.db("mobile").collection('category').find().toArray();

        return result;
    },


    deleteCategory: async (_id) => {
        const result = await client.db("mobile").collection('category').deleteOne({ "_id": new ObjectID(_id) });

        return result;
    },

    categoryUpdate: async (_id, category) => {
        if (_id.length < 11) {
            const result = await client.db("mobile").collection('category').insertOne({ category: category })
            return result;

        } else {
            const result = await client.db("mobile").collection('category').updateOne({ "_id": new ObjectID(_id) },
                { $set: { category: category } });
            return result;
        }
    },

    ProductUpdate: async (_id, name, priceNumber) => {
        const result = await client.db("mobile").collection('phones').updateOne({ "_id": new ObjectID(_id) },
            { $set: { name: name, price: priceNumber } });
        return result;
    },

    deleteProduct: async (_id) => {
        const result = await client.db("mobile").collection('phones').deleteOne({ "_id": new ObjectID(_id) });

        return result;
    },

    getMobile: async () => {
        const resultPhones = await client.db("mobile").collection('phones').find().toArray();
        const resultAccessories = await client.db("mobile").collection('products').find().toArray();

        return resultPhones.concat(resultAccessories);
    },

    getUsers: async () => {
        const result = await client.db("mobile").collection('users').find().toArray();

        return result;
    },


    UsernameCheck: async (username) => {
        return await client.db("mobile").collection("users").findOne({ username: username });

    },


    addFavorites: async (_id, id) => {

        await client.db("mobile").collection("users")
            .updateOne({ _id: _id }, { $push: { favorites: new ObjectID(id) } });
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

        const result = await Cart.updateOne({ "_id": new ObjectID(_id) },
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

        await client.db("mobile").collection("users")
            .updateOne({ _id: _id }, { $pull: { favorites: new ObjectID(id) } });


    },

    localStorage: async (_id) => {

        const user = await client.db("mobile").collection("users").findOne({ _id });

        if (user) {
            return user;
        } else {
            return null;
        }
    },


    MobileDetails: async (_id) => {

        return await Cart.aggregate([
            {
              $match: {
                _id: new mongoose.Types.ObjectId(_id), // Make sure you are using the correct ObjectId constructor
              },
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
        const result = await client.db("mobile").collection("phones").insertOne({
            src: selectedFileBase64,
            name: name,
            price: priceNumber,
            category: new ObjectID(category)
        });
        return result;
    },

    addCategory: async (category) => {

        const result = await client.db("mobile").collection("category").insertOne({ category: category });

        return result;
    },

    TokenCheck(cookie) {
        try {

            const result = jwt.verify(cookie, process.env.JWT_SECRET);
            return result;

        } catch (e) {
            return false;
        }
    },
}

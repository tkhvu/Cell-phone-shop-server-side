const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb+srv://tkhvu3552:a303095483@cluster0.92quexa.mongodb.net/");
const ObjectID = require('mongodb').ObjectId;




module.exports = {

    getCategory: async () => {
        const result = await client.db('mobile').collection('category').find().toArray();

        return result;
    },


    deleteCategory: async (_id) => {
        const result = await client.db('mobile').collection('category').deleteOne({ "_id": new ObjectID(_id) });

        return result;
    },

    categoryUpdate: async (_id, category) => {
        if (_id.length < 11) {
            const result = await client.db('mobile').collection('category').insertOne({ category: category })
            return result;

        } else {
            const result = await client.db('mobile').collection('category').updateOne({ "_id": new ObjectID(_id) },
                { $set: { category: category } });
            return result;

        }
    },

    ProductUpdate: async (_id, name, priceNumber) => {
        const result = await client.db('mobile').collection('phones').updateOne({ "_id": new ObjectID(_id) },
            { $set: { name: name, price: priceNumber } });
        return result;
    },

    deleteProduct: async (_id) => {
        const result = await client.db('mobile').collection('phones').deleteOne({ "_id": new ObjectID(_id) });

        return result;
    },

    getMobile: async () => {
        const resultPhones = await client.db('mobile').collection('phones').find().toArray();
        const resultAccessories = await client.db('mobile').collection('products').find().toArray();

        return resultPhones.concat(resultAccessories);
    },

    getUsers: async () => {
        const result = await client.db('mobile').collection('users').find().toArray();

        return result;
    },


    // userMatch: async (username) => {

    //     return await client.db("mobile").collection("users").find({
    //         username: username,
    //     }).toArray();
    // },


    UsernameCheck: async (username) => {

        return await client.db("mobile").collection("users").find({
            username: username,
        }).toArray();
    },


    addFavorites: async (_id, id) => {

        await client.db("mobile").collection("users")
            .updateOne({ _id: _id }, { $push: { favorites: new ObjectID(id) } });
    },



    addCart: async (_id, id) => {

        const cartExists = await client.db("mobile").collection("Cartmobile").findOne({ _id, "cart._id": new ObjectID(id) });

        if (cartExists) {
            await client.db("mobile").collection("Cartmobile").updateOne(
                { _id: _id, "cart._id": new ObjectID(id) },
                { $inc: { "cart.$.count": 1 } }
            );
        } else {
            await client.db("mobile").collection("Cartmobile").updateOne(
                { _id: _id },
                { $push: { cart: { _id: new ObjectID(id), count: 1 } } }
            );
        }
    },


    emptyCart: async (_id) => {

        const result = await client.db("mobile").collection("Cartmobile").updateOne({ "_id": new ObjectID(_id) },
            { $set: { cart: []} })
        return result;

    },


    addUser: async (firstname, lastname, email, username, hashedPwd) => {
        const password = hashedPwd
console.log(password)
        await client.db("mobile").collection("Cartmobile").insertOne({ cart: [] });
        const cartId = await client.db("mobile").collection("Cartmobile").find().sort({ _id: -1 }).limit(1).toArray();

        const result = await client.db("mobile").collection("users")
            .insertOne({ firstname, lastname, email, username, password, favorites: [], cart: [cartId[0]._id] });

        return result;
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
            return null; // Return null if the user is not found
        }
    },


    MobileDetails: async (_id) => {
        return await client.db("mobile").collection("Cartmobile").aggregate([
            {
                $match: {
                    _id: new ObjectID(_id),
                },
            },
            {
                $lookup:
                {
                    from: "phones",
                    localField: "cart._id",
                    foreignField: "_id",
                    as: "cart"

                }
            }
        ]).toArray();
    },

    getCart: async (_id) => {
        return await client.db("mobile").collection("Cartmobile").findOne({ _id });
    },

    deleteFromcart: async (_id, id) => {
        const result = await client.db("mobile").collection("Cartmobile").aggregate([
            {
                $match: { _id: new ObjectID(_id) }
            },
            {
                $project: {
                    cartIndex: {
                        $indexOfArray: ["$cart._id", new ObjectID(id)]
                    },
                    itemCount: { $arrayElemAt: ["$cart.count", { $indexOfArray: ["$cart._id", new ObjectID(id)] }] }
                }
            }
        ]).toArray();

        return result;
    },


    deleteObjectcart: async (_id, cartIndex) => {
        await client.db("mobile").collection("Cartmobile").updateOne(
            { _id: new ObjectID(_id) },
            {
                $unset: { [`cart.${cartIndex}`]: 1 }
            }
        );
        await client.db("mobile").collection("Cartmobile").updateOne(
            { _id: new ObjectID(_id) },
            {
                $pull: { cart: null }
            }
        );

    },

    cartUpdate: async (_id, id, count) => {
        await client.db("mobile").collection("Cartmobile").updateOne(
            { _id: new ObjectID(_id), "cart._id": new ObjectID(id) },
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

}

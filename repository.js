const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb+srv://tkhvu3552:a303095483@cluster0.92quexa.mongodb.net/");
const ObjectID = require('mongodb').ObjectId;




module.exports = {
    getMobile: async () => {

        const result = await client.db('mobile').collection('phones').find().toArray();
        return result;
    },


    userMatch: async (username, password) => {

        return await client.db("mobile").collection("users").find({
            username: username,
            password: password
        }).toArray();
    },


    addFavorites: async (_id, id) => {

        await client.db("mobile").collection("users")
            .updateOne({ _id: _id }, { $push: { favorites: new ObjectID(id) } });

    },



  addCart: async (_id, id) => {

    const cartExists = await client.db("mobile").collection("Cartmobile").findOne({ _id: _id, "cart._id": new ObjectID(id) });

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




    addUser: async (firstname, lastname, email, username, password) => {

        await client.db("mobile").collection("Cartmobile").insertOne({ cart: [] });
        const cartId  = await client.db("mobile").collection("Cartmobile").find().sort({ _id: -1 }).limit(1).toArray();

        const result = await client.db("mobile").collection("users")
            .insertOne({ firstname, lastname, email, username, password, favorites: [], cart: [cartId [0]._id] });

        return result;
    },

    deleteFavorites: async (_id, id) => {

        await client.db("mobile").collection("users")
            .updateOne({ _id: _id }, { $pull: { favorites: new ObjectID(id) } });


    },

    localStorage: async (_id) => {

        return await client.db("mobile").collection("users").findOne({ _id });
    },


    getCart: async (_id) => {
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

    deleteFromcart: async (_id, id) => {

        return await client.db("mobile").collection("users").aggregate([
            {
                $match: { _id: new ObjectID(_id) }
            },
            {
                $project: {
                    cartIndex: {
                        $indexOfArray: ["$cart", new ObjectID(id)]
                    }
                }
            }
        ]).toArray();


    },



    deletecart: async (_id, cartIndex) => {

        await client.db("mobile").collection("users").updateOne(
            { _id: new ObjectID(_id) },
            {
                $unset: { [`cart.${cartIndex}`]: 1 }
            }
        );

        await client.db("mobile").collection("users").updateOne(
            { _id: new ObjectID(_id) },
            {
                $pull: { cart: null }
            }
        );


    },






}

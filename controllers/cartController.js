const { emptyCart, cartDetails, addToCart, findCartItemDetails, cartUpdate, deleteObjectcart } = require("../repository");

module.exports = {
    emptyCart: async (req, res) => {
        try {
            await emptyCart(req.query._id);
            res.status(200).json({ message: 'cart updated successfully' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    getCart: async (req, res) => {

        try {
            let _id = req.query._id;
            const cart = await cartDetails(_id);
            if (cart) {
                res.status(200).json(cart);
            } else {
                res.status(404).json({ error: 'No items found' });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message })
        }
    },

    addCart: async (req, res) => {

        let _id = req.query._id;
        let id = req.query.id;

        try {
            await addToCart(_id, id);
            res.status(200).json({ message: 'Cart updated successfully' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message })
        }
    },



//     deleteFromcart: async (req, res) => {
//         console.log("result==",48)
//         console.log("result==", req.query._id)

//         let _id = req.query._id;
//         let id = req.query.id;
//         console.log("result==", _id)


//         try {
//             const result = await deleteFromcart(_id, id)
// console.log("result==", result)
//             if (result.length > 0) {
//                 const { cartIndex, itemCount } = result[0];
//                 if (itemCount > 1) {
//                     await cartUpdate(_id, id)
//                 } else {
//                     if (cartIndex >= 0) {
//                         await deleteObjectcart(_id, cartIndex)

//                         res.status(200).json({ message: "Item removed from cart." });
//                     } else {
//                         res.status(404).json({ message: "Item not found in cart." });
//                     }
//                 }
//             } else {
//                 res.status(404).json({ message: "User not found." });
//             }
//         } catch (e) {
//             console.error(e);
//             res.status(500).json({ error: e.message });
//         }

//     },


    UpdateTheCart: async (req, res) => {

        let _id = req.query._id;
        let id = req.query.id;
        let count = req.query.count
      
      
        try {
          const result = await findCartItemDetails(_id, id)

          if (result.length > 0) {
            const { cartIndex } = result[0];
      
            if (count >= 1) {
              await cartUpdate(_id, id, count)
            } else {
              if (cartIndex >= 0) {
      
                await deleteObjectcart(_id, cartIndex)
      
                res.status(200).json({ message: "Item removed from cart." });
              } else {
                res.status(404).json({ message: "Item not found in cart." });
              }
            }
          } else {
            res.status(404).json({ message: "User not found." });
          }
        } catch (e) {
          console.error(e);
          res.status(500).json({ error: e.message });
        }
      
      }
}



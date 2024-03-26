const { deleteProduct, ProductUpdate, getMobile } = require("../services/productService");
const { aggregateProductDetails } = require('../services/cartService');



module.exports = {

  getMobile: async (req, res) => {
    try {
      const mobiles = await getMobile();

      if (mobiles) {
        res.status(200).json(mobiles);
      } else {
        res.status(404).json({ error: 'No listings found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  MobileDetails: async (req, res) => {
    try {
      const cart = await aggregateProductDetails(req.query._id);
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

  deleteProduct: async (req, res) => {
    try {

      const category = await deleteProduct(req.query._id);

      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ error: 'No listings found' });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message })
    }
  },


  ProductUpdate: async (req, res) => {
    try {
      let _id = req.query._id;
      let name = req.query.name;
      let price = req.query.price;

      const priceNumber = parseInt(price);

      const Update = await ProductUpdate(_id, name, priceNumber);
      if (Update) {
        res.status(200).json(Update);
      } else {
        res.status(404).json({ error: 'The update failed' });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message })
    }
  }
}
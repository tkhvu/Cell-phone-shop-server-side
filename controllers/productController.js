const { deleteProduct, ProductUpdate} = require("../repository");



module.exports = {

deleteProduct : async (req, res) => {
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


  ProductUpdate : async (req, res) => {
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
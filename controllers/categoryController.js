const { getCategory, deleteCategory, categoryUpdate } = require('../services/categoryService');

module.exports = {
    getCategory: async (req, res) => {
        try {
            const category = await getCategory();
            if (category) {
                res.status(200).json(category);
            } else {
                res.status(404).json({ error: 'No listings found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },


    deleteCategory: async (req, res) => {
        try {
            const category = await deleteCategory(req.query._id);
            if (category) {
                res.status(200).json(category);
            } else {
                res.status(404).json({ error: 'The deletion failed' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    categoryUpdate : async (req, res) => {
        try {

          const Update = await categoryUpdate(req.query);

          if (Update) {
            res.status(200).json(Update);
          } else {
            res.status(404).json({ error: 'The update failed' });
          }
        } catch (e) {
          console.error(e);
          res.status(500).json({ error: e.message })
        }
      },
}
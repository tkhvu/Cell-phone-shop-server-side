const {deleteFavorites, addToFavorites } = require("../services/favoriteService");

module.exports = {
    deleteFavorites: async (req, res) => {
        try {
            await deleteFavorites(req.query._id, req.query.id);
            res.status(200).json({ message: 'Favorite updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    addFavorites: async (req, res) => {

        try {
          await addToFavorites(req.query)
          res.status(200).json({ message: 'favorites updated successfully' });
        } catch (e) {
          console.error(e);
          res.status(500).json({ error: e.message })
        }
      }
}

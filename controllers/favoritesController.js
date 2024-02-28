const {deleteFavorites, } = require("../repository");

module.exports = {
    deleteFavorites: async (req, res) => {
        try {
            await deleteFavorites(req.query._id, req.query.id);
            res.status(200).json({ message: 'Favorite updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}
const { getMobile, aggregateProductDetails } = require("../repository");

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
    }
}

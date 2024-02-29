const { emptyCart } = require("../repository");

module.exports = {
    emptyCart: async (req, res) => {
        try {
            await emptyCart(req.query._id);
            res.status(200).json({ message: 'cart updated successfully' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}



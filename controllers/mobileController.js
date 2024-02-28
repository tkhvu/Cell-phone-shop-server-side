const { getMobile } = require("../repository");

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
    }
}

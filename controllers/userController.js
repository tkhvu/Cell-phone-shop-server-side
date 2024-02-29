const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateUser, TokenCheck } = require("../repository");


module.exports = {

    matchUser: async (req, res) => {
        try {
            const cookie = req.cookies["token"];

            const user = await authenticateUser(req.body);

            if (user) {
                const matchUsername = bcrypt.compareSync(user.username, process.env.USERNAME_DIRECTOR);


                const userWithDirector = {
                    ...user._doc,
                    Director: matchUsername
                };
                const cookieValid = TokenCheck(cookie);
                if (!cookieValid) {

                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

                    res.status(200).cookie("token", token, { httpOnly: true, sameSite: 'None', secure: true });
                    res.status(200).cookie("_id", user._id, { httpOnly: true, sameSite: 'None', secure: true });
                    res.status(200).json(userWithDirector);
                }
                else {

                    res.status(200).cookie("_id", user._id, { httpOnly: true, sameSite: 'None', secure: true });
                    res.status(200).json(userWithDirector);
                }
            } else {

                const user = false
                res.status(200).json(user);
                // res.status(401).json({ message: 'Invalid username or password' });
            }
        } catch (e) {

            console.error(e);
            res.status(500).json({ error: e.message })
        }
    }
}
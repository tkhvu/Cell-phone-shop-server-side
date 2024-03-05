const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateUser, TokenCheck, addUser, localStorage, UsersDetails, UserameCheck } = require("../repository");


module.exports = {

    matchUser: async (req, res) => {
        try {
            const cookie = req.cookies["token"];

            const user = await authenticateUser(req.body);

            if (user) {

                const userWithDirector = {
                    ...user._doc,
                    Director: user.Director
                };
                const cookieValid = TokenCheck(cookie);
                if (!cookieValid) {

                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

                    res.status(200).cookie("token", token, { httpOnly: true, sameSite: 'None', secure: true });
                    res.status(200).cookie("_id", user._id, { httpOnly: true, sameSite: 'None', secure: true }).json(userWithDirector);
                }
                else {

                    res.status(200).cookie("_id", user._id, { httpOnly: true, sameSite: 'None', secure: true }).json(userWithDirector);
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
    },


    addUser: async (req, res) => {

        try {
            const { firstname, lastname, email, username, password } = req.body;
            const hashedPwd = await bcrypt.hash(password, 10);
            const result = await addUser(firstname, lastname, email, username, hashedPwd);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'No new user was created' });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message })
        }
    },

    localStorage: async (req, res) => {

        try {
            let _id = req.cookies["_id"];
            const user = await localStorage(_id);

            if (!user) {
                res.status(404).json({ error: 'No stranger found' });
            } else {
                const userWithDirector = {
                    ...user._doc,
                    Director: user.Director
                };
                res.status(200).json(userWithDirector);
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message })
        }
    }, 

    getUsers :async (req, res) => {
        try {
          const cookie = req.cookies["token"];
          jwt.verify(cookie, process.env.JWT_SECRET);
          const users = await UsersDetails();
          if (users) {
            res.status(200).json(users);
          } else {
            res.status(404).json({ error: 'No listings found' });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: error.message })
        }
      },

      findUser: async (req, res) => {
        try {
      
          const user = await UserameCheck(req.query.username);
      
          if (user) {
            res.status(200).json({ available: true });
          } else {
            res.status(200).json({ available: false });
          }
        } catch (e) {
          console.error(e);
          res.status(500).json({ error: e.message });
        }
      }
}
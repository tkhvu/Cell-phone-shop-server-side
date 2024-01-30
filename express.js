const express = require('express');
const app = express()
const router = express.Router();
const cors = require('cors');
app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200', "http://localhost:64784", "https://api-pi72mex7aq-uc.a.run.app", "https://ringtones-79130.firebaseapp.com"]
}))
app.use('/', router);
app.use(express.json());
const { getMobile, addFavorites, addUser, emptyCart, getUsers, categoryUpdate, UsernameCheck,
  localStorage, deleteProduct, ProductUpdate, getCategory, addCart, addProduct, deleteFromcart, MobileDetails,
  deleteFavorites, getCart, deleteObjectcart, cartUpdate, deleteCategory, TokenCheck } = require("./repository");
const { SENDMAIL } = require("./email");
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser())
require('dotenv').config({ path: "./config.env" });




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

app.post('/userMatch', async (req, res) => {

  try {
    const { username, password } = req.body;
    const cookie = req.cookies["token"];
    const usernameDirector = "$2b$10$xJ3RUU8EMgkQ8AaYlfRLkeGqdMpYhnAutv0asx3fqOaXt/sYRkjzi";

    const user = await UsernameCheck(username);
    if (user) {
      const matchUsername = bcrypt.compareSync(username, usernameDirector);
      const match = bcrypt.compareSync(password, user.password);

      const userWithDirector = {
        ...user._doc,
        Director: matchUsername
      };
      if (match) {
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
      }
    } else {

      const user = false
      res.status(200).json(user);
    }
  } catch (e) {

    console.error(e);
    res.status(500).json({ error: e.message })
  }
})


app.get('/getMobile', async (req, res) => {
  try {
    const mobiles = await getMobile();

    if (mobiles) {
      res.status(200).json(mobiles);
    } else {
      res.status(404).json({ error: 'No listings found' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }
})

router.get('/getCategory', async (req, res) => {
  try {
    const category = await getCategory();
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: 'No listings found' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }
})


router.get('/deleteCategory', async (req, res) => {
  try {
    let _id = req.query._id;
    const category = await deleteCategory(_id);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: 'No listings found' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }
})


router.get('/emptyCart', async (req, res) => {
  try {
    let _id = req.query._id;
    const cart = await emptyCart(_id);
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ error: 'No listings found' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }
})


router.get('/categoryUpdate', async (req, res) => {
  try {
    let _id = req.query._id;
    let category = req.query.category;
    const Update = await categoryUpdate(_id, category);
    if (Update) {
      res.status(200).json(Update);
    } else {
      res.status(404).json({ error: 'No listings found' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }
})

router.get('/deleteProduct', async (req, res) => {
  try {
    let _id = req.query._id;
    const category = await deleteProduct(_id);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: 'No listings found' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }
})

router.get('/ProductUpdate', async (req, res) => {
  try {
    let _id = req.query._id;
    let name = req.query.name;
    let price = req.query.price;

    const priceNumber = parseInt(price);

    const Update = await ProductUpdate(_id, name, priceNumber);
    if (Update) {
      res.status(200).json(Update);
    } else {
      res.status(404).json({ error: 'No listings found' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }
})

app.post('/Emailorderconfirmation', (req, res) => {
  try {
    const cookie = req.cookies["token"];
    jwt.verify(cookie, process.env.JWT_SECRET);

    const { firstname, lastname, email } = req.body.user;
    const orderedPhoneDetails = req.body.orders;
    const { phone, City, Street, Housenumber, Apartmentnumber } = req.body.DeliveryDetails;
    SENDMAIL(firstname, lastname, email, orderedPhoneDetails, phone, City, Street, Housenumber, Apartmentnumber);
    res.status(200).json('Email sent successfully');
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});



router.get('/MobileDetails', async (req, res) => {

  try {
    let _id = req.query._id;
    const cart = await MobileDetails(_id);
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ error: 'No listings found' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }
})


router.get('/getCart', async (req, res) => {

  try {
    let _id = req.query._id;
    const cart = await getCart(_id);
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ error: 'No listings found' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }
})



app.get('/getUsers', async (req, res) => {
  try {
    const cookie = req.cookies["token"];
    jwt.verify(cookie, process.env.JWT_SECRET);
    const users = await getUsers();
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ error: 'No listings found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message })
  }
})


router.get('/addCart', async (req, res) => {

  let _id = req.query._id;
  let id = req.query.id;

  try {
    await addCart(_id, id);
    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }
})


app.post('/CreatingUser', async (req, res) => {

  try {
    const { firstname, lastname, email, username, password } = req.body;
    const hashedPwd = await bcrypt.hash(password, 10);
    const result = await addUser(firstname, lastname, email, username, hashedPwd);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: 'No updated' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }
})


router.get('/UsernameCheck', async (req, res) => {
  try {
    let username = req.query.username;

    const user = await UsernameCheck(username);
    // console.log(user)

    if (user) {
      res.status(200).json({ available: true });
    } else {
      res.status(200).json({ available: false });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get('/addFavorites', async (req, res) => {

  let _id = req.query._id;
  let id = req.query.id;

  try {

    await addFavorites(_id, id)
    res.status(200).json({ message: 'favorites updated successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }

})


router.get('/deleteFavorites', async (req, res) => {

  let _id = req.query._id;
  let id = req.query.id;

  try {
    await deleteFavorites(new ObjectID(_id), id)
    res.status(200).json({ message: 'favorites updated successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }

})

app.get('/localStorage', async (req, res) => {

  try {
    let _id = req.cookies["_id"];
    console.log("_id==", _id)
    const user = await localStorage(_id);
    const username = "$2b$10$/oOfWYa3EGBsvGhPQv8NaOdq3eX7mfdBtBaSmiLjmOT4mQ/X6WN/u";

    const match = bcrypt.compareSync(user.username, username);

    if (!user) {
      res.status(404).json({ error: 'No listings found' });
    } else {
      if (match) {
        const userWithDirector = {
          ...user._doc,
          Director: match
        };

        res.status(200).json(userWithDirector);
      } else {
        res.status(200).json(user);
      }
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }
})


router.get('/deleteFromcart', async (req, res) => {

  let _id = req.query._id;
  let id = req.query.id;


  try {
    const result = await deleteFromcart(_id, id)

    if (result.length > 0) {
      const { cartIndex, itemCount } = result[0];
      if (itemCount > 1) {
        await cartUpdate(_id, id)
      } else {
        if (cartIndex >= 0) {
          await deleteObjectcart(_id, cartIndex)

          res.status(200).json({ message: "Item removed from cart." });
        } else {
          res.status(404).json({ message: "Item not found in cart." });
        }
      }
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }

})


router.get('/cartUpdate', async (req, res) => {

  let _id = req.query._id;
  let id = req.query.id;
  let count = req.query.count


  try {
    const result = await deleteFromcart(_id, id)

    if (result.length > 0) {
      const { cartIndex } = result[0];

      if (count >= 1) {
        await cartUpdate(_id, id, count)
      } else {
        if (cartIndex >= 0) {

          await deleteObjectcart(_id, cartIndex)

          res.status(200).json({ message: "Item removed from cart." });
        } else {
          res.status(404).json({ message: "Item not found in cart." });
        }
      }
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }

})





app.post('/upload', upload.single('image'), async (req, res) => {

  try {
    const imagePath = req.file.path;
    const price = req.body.price;
    const name = req.body.name;
    const category = req.body.category;

    const priceNumber = parseInt(price);


    const imageData = await new Promise((resolve, reject) => {
      fs.readFile(imagePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    const base64Image = imageData.toString('base64');

    const formattedImage = `data:image/png;base64,${base64Image}`;

    await addProduct(formattedImage, name, priceNumber, category);

    fs.unlink(imagePath, err => {
      if (err) {
        console.error(err);
      }
    });

    res.json({ message: 'Product added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.post('/addCategory', async (req, res) => {
//   try {
//     const { category } = req.body;

//     const result = await addCategory(category);
//     if (result) {
//       res.status(200).json(result);
//     } else {
//       res.status(404).json({ error: 'No listings found' });
//     }
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: e.message })
//   }
// })



const PORT = process.env.PORT || 3000;
app.listen(PORT);

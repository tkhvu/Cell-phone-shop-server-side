const express = require('express');
const app = express()
const router = express.Router();
const cors = require('cors');
app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200', "https://api-pi72mex7aq-uc.a.run.app", 
  "https://online-shop-491d5.firebaseapp.com"]
}))
app.use('/', router);
app.use(express.json());
const { addFavorites, getUsers, findUser, addCart, addProduct, deleteFromcart, MobileDetails,
   getCart, deleteObjectcart, cartUpdate } = require("./repository");
// const { sendEmail } = require("./email/email");
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

const {deleteFavorites} = require('./controllers/favoritesController');
const {getMobile} = require('./controllers/mobileController');
const {getCategory, deleteCategory, categoryUpdate} = require('./controllers/categoryController');
const {emptyCart} = require('./controllers/cartController');
const {matchUser, addUser, localStorage} = require('./controllers/userController');
const { deleteProduct, ProductUpdate } = require('./controllers/productController');
const {sendOrderConfirmationEmail} = require('./controllers/emailController');


app.delete('/deleteFavorites', deleteFavorites);
app.get('/getMobile', getMobile);
app.get('/getCategory', getCategory)
app.get('/deleteCategory', deleteCategory)
app.get('/emptyCart', emptyCart)
app.post('/userMatch', matchUser)
app.post('/CreatingUser', addUser)
app.get('/localStorage', localStorage)
app.get('/categoryUpdate', categoryUpdate)
app.delete('/deleteProduct', deleteProduct)
app.get('/ProductUpdate', ProductUpdate)
app.post('/Emailorderconfirmation', sendOrderConfirmationEmail)


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


router.get('/UsernameCheck', async (req, res) => {
  try {
    let username = req.query.username;

    const user = await findUser(username);
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


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });


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

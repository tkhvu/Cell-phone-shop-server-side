const express = require('express');
const app = express()
const router = express.Router();
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;
const client = new MongoClient("mongodb+srv://tkhvu3552:a303095483@cluster0.92quexa.mongodb.net/");
const cors = require('cors');
app.use(cors());
app.use('/', router);
app.use(express.json());
const { getMobile, userMatch, addFavorites, addUser, localStorage, addCart, addProduct, deleteFromcart, MobileDetails, deleteFavorites, getCart, deleteObjectcart, cartUpdate } = require("./repository");
const { SENDMAIL } = require("./email");
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.post('/some-route', (req, res) => {
  const requestBody = req.body;
  res.json(requestBody);
});


app.post('/Emailorderconfirmation', (req, res) => {
  try {
    const { firstname, lastname, email } = req.body.user[0];
    const orderedPhoneDetails = req.body.orders;
    const { phone, City, Street, Housenumber, Apartmentnumber } = req.body.DeliveryDetails;

    SENDMAIL(firstname, lastname, email, orderedPhoneDetails, phone, City, Street, Housenumber, Apartmentnumber);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});



router.get('/MobileDetails', async (req, res) => {

  try {
    let _id = req.query._id;
    const cart = await MobileDetails(new ObjectID(_id));
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
    const cart = await getCart(new ObjectID(_id));
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




router.get('/getMobile', async (req, res) => {
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


router.get('/addCart', async (req, res) => {

  let _id = req.query._id;
  let id = req.query.id;

  try {
    await addCart(new ObjectID(_id), id);
    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }
})


app.post('/CreatingUser', async (req, res) => {

  try {
    const { firstname, lastname, email, username, password } = req.body;
    const result = await addUser(firstname, lastname, email, username, password);
    console.log(result)
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


router.get('/userMatch', async (req, res) => {

  try {
    let username = req.query.username;
    let password = req.query.password;

    const user = await userMatch(username, password);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'No listings found' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message })
  }
})


router.get('/addFavorites', async (req, res) => {

  let _id = req.query._id;
  let id = req.query.id;

  try {

    await addFavorites(new ObjectID(_id), id)
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

router.get('/localStorage', async (req, res) => {

  try {
    let _id = req.query._id;
    const user = await localStorage(new ObjectID(_id));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'No listings found' });
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
      if (count > 1) {
        await cartUpdate(_id, id, count)
        console.log("if===", count)
      } else {
        if (cartIndex >= 0) {
          console.log(count)

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

app.use(express.static(path.join(__dirname, 'public')));


app.post('/upload', upload.single('image'), (req, res) => {
  const imagePath = req.file.path;
  const price = req.body.price; 
  const name = req.body.name;
  const category = req.body.category;

  fs.readFile(imagePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const base64Image = data.toString('base64');
    const datas = `data:image/jpeg;base64,${base64Image}`;
    addProduct(datas, name, price, category);
    res.json({ base64Image });
  });
});





const PORT = process.env.PORT || 3000;
app.listen(PORT);
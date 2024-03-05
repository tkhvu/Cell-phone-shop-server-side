const fs = require('fs');
const multer = require('multer');
const { addProduct } = require("../repository");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

module.exports = {

upload: multer({ storage }),

uploadProductImage : async (req, res) => {
  try {
    const imagePath = req.file.path;
    const price = req.body.price;
    const name = req.body.name;
    const category = req.body.category;

    const priceNumber = parseInt(price);

    let imageData;
    try {
      imageData = await fs.promises.readFile(imagePath);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read image file' });
    }

    const base64Image = imageData.toString('base64');
    const formattedImage = `data:image/png;base64,${base64Image}`;

    await addProduct(formattedImage, name, priceNumber, category);

    res.json({ message: 'Product added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (req.file && req.file.path) {
      await fs.promises.unlink(req.file.path).catch(console.error);
    }
  }
}
}

// module.exports = {
//   upload,
//   uploadProductImage
// };

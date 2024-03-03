const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect("mongodb+srv://" + process.env.USERNAME_PASSWORD + "@cluster0.92quexa.mongodb.net/mobile", {
}).then(() => {
  console.log('Successfully connected to MongoDB');
}).catch(err => {
  console.error('Connection error', err.message);
});

const cartmobileSchema = new mongoose.Schema({
    cart: [{ type: Schema.Types.ObjectId, ref: 'phones' }],
    
});



const cartItemSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'phones', // Assuming 'Item' is another schema you want to reference
  },
  count: {
    type: Number,
    default: 1,
  }
}, { _id: false }); // Use "_id: false" if you don't want Mongoose to create an _id for sub-documents


const cartSchema = new Schema({
  cart: {
    type: [cartItemSchema],
    default: [] 
  }
});

const Cart = mongoose.model('Carts', cartSchema);

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Favorite' }],
  cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
  Director: { type: Boolean, required: true },
});

const User = mongoose.model('users', userSchema);


const phoneSchema = new Schema({
    name: { type: String, required: true},
    price: { type: Number, required: true},
    src: { type: String, required: true},
    category: { type: Schema.Types.ObjectId, required: true, ref: 'Category'  }
  });
  
  const Phone = mongoose.model('phones', phoneSchema);

  const categorySchema = new Schema({
    category: {
      type: String,
      required: true
    }
  });
  
  const Category = mongoose.model('category', categorySchema);

module.exports = { Cart, User, Phone, Category };

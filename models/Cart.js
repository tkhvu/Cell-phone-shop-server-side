// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const cartItemSchema = new Schema({
//   _id: {
//     type: Schema.Types.ObjectId,
//     ref: 'phones',
//   },
//   count: {
//     type: Number,
//     default: 1,
//   }
// }, { _id: false });

// const cartSchema = new Schema({
//   cart: {
//     type: [cartItemSchema],
//     default: [] 
//   }
// });

// const Cart = mongoose.model('Carts', cartSchema);

// module.exports = Cart;


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// mongoose.connect("mongodb+srv://" + process.env.USERNAME_PASSWORD + "@cluster0.92quexa.mongodb.net/mobile", {
// }).then(() => {
//   console.log('Successfully connected to MongoDB');
// }).catch(err => {
//   console.error('Connection error', err.message);
// });

// const cartmobileSchema = new mongoose.Schema({
//     cart: [{ type: Schema.Types.ObjectId, ref: 'phones' }],
    
// });



const cartItemSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'phones',
  },
  count: {
    type: Number,
    default: 1,
  }
}, { _id: false }); 


const cartSchema = new Schema({
  cart: {
    type: [cartItemSchema],
    default: [] 
  }
});

const Cart = mongoose.model('Carts', cartSchema);



module.exports = Cart;


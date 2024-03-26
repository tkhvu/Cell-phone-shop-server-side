const mongoose = require('mongoose');
const Schema = mongoose.Schema;


mongoose.connect("mongodb+srv://" + process.env.USERNAME_PASSWORD + "@cluster0.92quexa.mongodb.net/mobile", {
}).then(() => {
  console.log('Successfully connected to MongoDB');
}).catch(err => {
  console.error('Connection error', err.message);
});

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

module.exports = User;

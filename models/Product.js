const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const phoneSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    src: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, required: true, ref: 'Category' }
});

const Product = mongoose.model('phones', phoneSchema);



module.exports = Product;

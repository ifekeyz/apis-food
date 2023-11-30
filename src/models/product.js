const mongoose = require('mongoose');



// Define the Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  measurement: { type: String, required: true }, // like weight for rice e.g. 50kg or quantity for oil e.g. 1ltr
  type: { type: String, required: true }, // like small grain or long grain for rice
  price: { type: Number, required: true },
  quantity:{ type: Number, required: true },
  image: { type: String, required: true }, // Required image field
  images: [{
    type: String,
  }],
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;

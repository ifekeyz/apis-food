const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  measurement: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: [cartItemSchema], // Array of cart items
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  measurement: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userFullname:{type: String},
  orderItems: [orderItemSchema],
  status: { type: String, enum: ['pending', 'delivered','approved','declined'], default: 'pending' },
  orderNumber:{type:String},
  orderDate: { type: Date, default: Date.now },
  deliveryDetails: {
    city: String,
    state: String,
    location: String,
    phoneNumber: String,
  },
  allItemsTotalPrice: { type: Number, required: true },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

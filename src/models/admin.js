const mongoose = require('mongoose');

const adminVatSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  vat: { type: Number, required: true },
  serviceFee: { type: Number, required: true },
  deliveryFee:{type:Number, required:true},
  date: { type: Date, default: Date.now },
});

const AdminVat = mongoose.model('Adminvat', adminVatSchema);

module.exports = AdminVat;

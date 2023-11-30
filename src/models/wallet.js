const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalLoan: { type: Number, required: true },
  paidLoan: { type: Number, required: true },
  balance:{
    type:Number
  },
  currentLoan:{type:Number}
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;

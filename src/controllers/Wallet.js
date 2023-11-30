const Wallet = require('../models/wallet');
const User = require('../models/user');
const Order = require('../models/order');

const getWalletDetails = async (req, res) => {
    try {
        const {userMail} = req.body
        
        const wallet = await Wallet.findOne({ userMail });

        if (!wallet) {
            res.status(404).json({ message: 'Wallet not found' });
        }

        res.status(200).json(wallet); // Return the wallet details if found
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
}

const calculateOutstandingLoan = async (req, res) => {
    try {
        const {userMail} = req.body
        // Find the user's salary based on userMail
        const user = await User.findOne({ email: userMail });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        
        // Calculate the total outstandingLoan for the user
        const order = await Order.find({ user: user._id });
        // const outstandingLoan = order.totalPrice - 0.3 * user.salary;
        const outstandingLoan = order.totalPrice / 0.3;
        const amountLeft = ordertotalprice - order.paidloan
    
        // Update the user's wallet with the calculated outstandingLoan
        const wallet = await Wallet.findOne({ userMail });
        if (!wallet) {
            res.status(404).json({ message: 'Wallet not found' });
        }
        
        wallet.outstandingLoan = outstandingLoan;
        wallet.amountLeft = amountLeft;
        await wallet.save();
    
        res.status(201).json({wallet, message:"Outstanding loan updated"});
      } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
      }
}



module.exports = {
    getWalletDetails,
    calculateOutstandingLoan
};

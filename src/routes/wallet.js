const { User } = require('../models/user');
const express = require('express');
const Wallet = require('../models/wallet');
const Order = require('../models/order');
const router = express.Router();

router.post('/createWallet', async (req, res) => {
    try {
        const { userId } = req.body; // Destructure userId from the request body

        // Check if the user exists
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const salary = user.salary
        

        // Create a new wallet entry
        const wallet = new Wallet({
            userId: userId,
            totalLoan: 0.00,
            paidLoan: 0.00,
            balance:salary,
            currentLoan:0.00
        });

        // Save the wallet entry to the database
        await wallet.save();

        res.status(200).json({ wallet, message: 'Wallet created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating wallet', error: error.message });
    }
});

router.get('/getWallet/:userId', async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from the request parameters

        // Find the wallet entry for the specified userId
        const wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found for the user' });
        }

        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wallet data', error: error.message });
    }
});

router.get('/monthlyPayBack/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // Find the user's salary based on userMail
        const user = await User.findOne({_id: userId });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }

        // Calculate the total outstandingLoan for the user
        const order = await Order.find({ user: user._id });

        // const outstandingLoan = order.totalPrice - 0.3 * user.salary;
        const outstandingLoan = order.totalPrice / 0.3;
        const amountLeft = order.totalprice - order.paidloan

        // Update the user's wallet with the calculated outstandingLoan
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            res.status(404).json({ message: 'Wallet not found' });
        }

        wallet.outstandingLoan = outstandingLoan;
        wallet.amountLeft = amountLeft;
        await wallet.save();

        res.status(200).json({ wallet, message: "Outstanding loan updated" });
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
})


module.exports = router;
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { User } = require('../models/user');

// Create the email transporter with your email settings
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: 'sovereigntechnology01@gmail.com', 
        pass: 'rqjcpfdszavqbpby'
    }
});



router.post('/send-verification-code', async (req, res) => {
    const { email } = req.body;

    // Generate a 4-digit verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const userEmail = await User.findOne({ email });
    if (!userEmail) {
        res.status(400).json({ error: 'Invalid verification code' });
        return;
    }

    // Email content
    const mailOptions = {
        from: 'sovereigntechnology01@gmail.com',
        to: email,
        subject: 'FoodLoanBank OTP Code',
        text: `Your OTP code for reset password is : ${verificationCode}`,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);

        // Update the user with the verification code
        const user = await User.findOneAndUpdate(
            {email},
            { verificationCode },
            { new: true }
        );

        if (!user) {
            res.status(400).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'Verification code sent successfully', id: user._id });
    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({ error: 'Failed to send verification code' });
    }
});


router.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user || user.verificationCode !== code) {
            res.status(400).json({ error: 'Invalid verification code' });
            return;
        }

        user.verificationCode = '';
        await user.save();

        res.status(200).json({ message: 'Verification successful', userId: user._id });
    } catch (error) {
        console.error('Error verifying verification code:', error);
        res.status(500).json({ error: 'Failed to verify verification code' });
    }
});

module.exports = router;
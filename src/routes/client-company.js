const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const ClientCompany = require('../models/clientCompany');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})
const uploadOptions = multer({ storage: storage })


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: 'sovereigntechnology01@gmail.com',
        pass: 'rqjcpfdszavqbpby'
    }
});

router.get('/', async (req, res) => {
    try {
        const userList = await ClientCompany.find().select('-passwordHash');
        res.json(userList);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});



router.get('/:id', async (req, res) => {
    const user = await ClientCompany.findById(req.params.id).select('-passwordHash');
    if (!user) {
        res.status(500).json({ message: "The user with the given ID was not found" });
    }
    res.json(user);
});

router.post('/', async (req, res) => {
    try {
        const user = await ClientCompany.findOne({ email: req.body.companyEmail });
        if (user) {
            return res.status(500).json({ message: "Oops! Provided email already exists. Please use another email address." });
        }

        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

        const newUser = new ClientCompany({
            companyName: req.body.companyName,
            companyEmail: req.body.companyEmail,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            verificationCode: verificationCode,
        });

        await newUser.save();

        // Email content
        const mailOptions = {
            from: 'sovereigntechnology01@gmail.com',
            to: req.body.companyEmail,
            subject: 'OTP-Request',
            text: `Your verification code for FoodBankApp Registration is : ${verificationCode}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Verification code sent successfully', newUser });
    } catch (error) {
        console.error('Error creating user and sending verification code:', error);
        res.status(500).json({ error: 'Failed to create user and send verification code' });
    }
});


router.post('/verify-code', async (req, res) => {
    const { companyEmail, code } = req.body;

    try {

        const user = await ClientCompany.findOne({ companyEmail });

        if (!user || user.verificationCode !== code) {
            res.status(400).json({ error: 'Invalid verification code or company Email address' });
            return;
        }

        user.verificationCode = '';
        await user.save();

        res.status(200).json({ message: 'Verification successful', user });
    } catch (error) {
        console.error('Error verifying verification code:', error);
        res.status(500).json({ error: 'Failed to verify verification code' });
    }
});


router.put('/:companyId', uploadOptions.single('image'), async (req, res) => {
    try {
        const { companyId } = req.params;
        const { staffStrength, address, companyPhone, industryType } = req.body;
        const file = req.file;
        if (!file) { return res.status(400).send("No image in the request") }
        const fileName = req.file.filename
        const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        const user = await ClientCompany.findById(companyId);

        if (!user) {
            return res.status(404).json({ message: "Company with ID not found" });
        }
        user.staffStrength = staffStrength || '';
        user.address = address || '';
        user.companyPhone = companyPhone || '';
        user.industryType = industryType || '';
        user.companyLogo = `${basepath}${fileName}` || '';
        user.isApproved = true


        await user.save();
        res.status(200).json({ message: 'Company Registration issuccessfully',user });
    } catch (e) {
        console.log("Registration Completion Error", e)
        res.status(500).json({ message: 'An error occurred during registration completion' });
    }
});


router.post('/login', async (req, res) => {
    const user = await ClientCompany.findOne({ companyEmail: req.body.companyEmail })
    const secret = process.env.secret;

    if (!user) {
        return res.status(400).send(`The company with email not found`);
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user._id,
                isAdmin: user.isApproved
            },
            secret,
            { expiresIn: '5m' }
        )
        res.status(200).send({ user, token: token })
    }
    else {
        res.status(400).send('Opps! Password is wrong')
    }
});

module.exports = router;
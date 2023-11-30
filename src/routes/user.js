const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');

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
    const userList = await User.find().select('-passwordHash');
    if (!userList) {
        res.status(500).json({ success: false });
    }
    res.json(userList);
});

router.get('/singleUser/:userId', async (req, res) => {

    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);

});



router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
        res.status(500).json({ message: "The user with the given ID was not found" });
    }
    res.send(user);
});



router.post('/', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(500).json({ message: "Oops! Provided email already exists. Please use another email address." });
        }

        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

        const newUser = new User({
            fullname: req.body.fullname,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            verificationCode: verificationCode,
        });

        await newUser.save();

        // Email content
        const mailOptions = {
            from: 'sovereigntechnology01@gmail.com',
            to: req.body.email, // Use the provided email from the request
            subject: 'OTP-Request',
            text: `Your verification code for FoodBankApp Registration is : ${verificationCode}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Verification code sent successfully', user: newUser.email, id: newUser.id });
    } catch (error) {
        console.error('Error creating user and sending verification code:', error);
        res.status(500).json({ error: 'Failed to create user and send verification code' });
    }
});

router.put('/resend-mail', async (req, res) => {
    try {

        const email = req.body.companyEmail
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({ message: "User with company email address not found" });
        }
        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
        // Email content
        const mailOptions = {
            from: 'sovereigntechnology01@gmail.com',
            to: req.body.email, // Use the provided email from the request
            subject: 'New OTP-Request',
            text: `Your verification code for FoodBankApp Registration is : ${verificationCode}`,
        };

        await transporter.sendMail(mailOptions);
        user.verificationCode = verificationCode

        await user.save();

        res.status(200).json({ message: 'Verification code sent successfully', user: user.email, id: user.id });
    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({ error: 'Failed to  send verification code' });
    }
})

router.post('/register', async (req, res) => {
    const useremail = await User.findOne({ email: req.body.email })
    if (useremail) {
        return res.status(500).json({ message: "Opps! Provided email already exist use another email address" })
    }
    let user = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin: true,
        isMember: true,
        isApproved: true
    })
    user = await user.save();

    if (!user) {
        return res.status(500).send({ message: "the user can not be created" });
    }
    res.send(user);


});



router.put('/:userId', uploadOptions.single('image'), async (req, res) => {
    try {
        const { userId } = req.params;
        const { phonenumber, address, company, jobtitle, salary, staffId } = req.body;
        const file = req.file;
        if (!file) { return res.status(400).send("No image in the request") }
        const fileName = req.file.filename
        const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.phonenumber = phonenumber || '';
        user.address = address || '';
        user.company = company || '';
        user.jobtitle = jobtitle || '';
        user.staffId = staffId || '';
        user.salary = salary || '';
        user.image = `${basepath}${fileName}` || '';
        user.isMember = true


        await user.save();
        res.status(200).json({ message: 'Registration completed successfully' });
    } catch (e) {
        console.log("Registration Completion Error", e)
        res.status(500).json({ message: 'An error occurred during registration completion' });
    }
});


router.put('/adminUpdateUser/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { fullname, email, phonenumber, address, company, jobtitle } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.fullname = fullname || '',
            user.email = email || '',
            user.phonenumber = phonenumber || '';
        user.address = address || '';
        user.company = company || '';
        user.jobtitle = jobtitle || '';


        await user.save();
        res.status(200).json({ message: 'Update completed successfully' });
    } catch (e) {
        console.log("Registration Completion Error", e)
        res.status(500).json({ message: 'An error occurred during registration completion' });
    }
});


router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    const secret = process.env.secret;

    if (!user) {
        return res.status(400).send(`The user with email not found`);
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            { expiresIn: '5m' }
        )
        res.status(200).send({ user: user.email, token: token, id: user.id, approve: user.isApproved, payment: user.isPayment, member: user.isMember })
    }
    else {
        res.status(400).send('Opps! Password is wrong')
    }
});


router.put('/approveUser/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({ message: 'user not found' });
        }
        if (user.isApproved == false) {

            user.isApproved = true;
            await user.save();
            // Email content
            const mailOptions = {
                from: 'sovereigntechnology01@gmail.com',
                to: user.email,
                subject: 'Approval',
                html: `Hi <p>${user.fullname},</p>
           <p>Congratulations! We have approved your registration with us. You can now log in to make a one-time registration fee payment and explore our great offers.</p>
           <p>We want you to know that the aim of this is to simplify the burden, and we have got this right with you.</p>
           <p>Regards,</p>
           <p>Team FoodBank.</p>`
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ message: 'User approved successfully' });
        } else {
            return res.status(400).json({ message: 'User cannot be accepted in its current state' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
});


router.put('/declineUser/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const reason = req.body.reason

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({ message: 'user not found' });
        }
        if (user.isApproved === false) {
            const mailOptions = {
                from: 'sovereigntechnology01@gmail.com',
                to: user.email,
                subject: 'Rejection',
                html: `Hi <p>${user.fullname},</p>
           <p>Your registration was not successful due to the following reasons kindly revert back to the email below.</p>
           <p>${reason}</p>
           <p>Regards,</p>
           <p>Team FoodBank.</p>`
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ message: 'User rejected successfully' });
        } else {
            return res.status(400).json({ message: 'User cannot be rejected in its current state' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
});


router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: 'the user is delected!' });
        }
        else {
            return res.status(400).json({ success: false, message: 'Opps! user not found.' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
});



router.put('/make-payment/:id', async (req, res) => {

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            isPayment: true,
        },
        { new: true }
    )
    if (!user) {
        return res.status(400).send("The user cannot be updated!")
    }
    res.send(user);
});



router.get('/get/count', async (req, res) => {
    const userCount = await User.countDocuments();

    if (!userCount) {
        res.status(500).json({ success: false, message: "Opps! error getting the count value" });
    }
    res.send({
        userCount: userCount
    });
});


router.put('/change/password/:id', async (req, res) => {
    const userExist = await User.findById(req.params.id);

    let newPassword
    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    }
    else {
        newPassword = userExist.passwordHash;

    }
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10)
        },
        { new: true }
    )
    if (!user) {
        return res.status(400).send("The user cannot be created! ")
    }
    res.send(user);
});

module.exports = router;
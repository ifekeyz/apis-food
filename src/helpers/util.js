const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: 'sovereigntechnology01@gmail.com',
        pass: 'rqjcpfdszavqbpby'
    }
});


module.exports = {
    transporter
};
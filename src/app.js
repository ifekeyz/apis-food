const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

const dotenv = require('dotenv');
const { config } = require('./config/config');
const helmet = require('helmet');
const morgan = require('morgan')
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }))
app.use(express.urlencoded({ extended: true }))

//Middleware    
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);


// Routes
const usersRoutes = require('./routes/user')
const userOtpRoutes = require('./routes/user-verfiy')

const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/product')
const walletRoutes = require('./routes/wallet')
const clientCompanyRoutes = require('./routes/client-company')


//api from env
const api = process.env.API_URL;


// Routers
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/user`, userOtpRoutes);
app.use(`${api}/product`, productRoutes);
app.use(`${api}/wallet`, walletRoutes);
app.use(`${api}/cart`, cartRoutes);
app.use(`${api}/order`, orderRoutes);
app.use(`${api}/admin`, adminRoutes);
app.use(`${api}/company`,clientCompanyRoutes)

app.use(helmet())


app.get("/", (req, res) => {
    return res.status(200).send("Food bank apis")
});



app.use('/api', notificationRoutes);

module.exports = app
const dotenv = require("dotenv");
dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URL = "mongodb+srv://devFeranmi:admin12345@cluster0.yu3zser.mongodb.net/sovereigntechltd?retryWrites=true&w=majority";
const flutterwavePublicKey = 'FLWPUBK-bd32c5c68a5ca9c364585612967d2633-X';

const SERVER_PORT = process.env.PORT || 3000

const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    }
}

const mongoUrl = config.mongo.url
const serverPort = config.server.port

module.exports = {mongoUrl, serverPort,flutterwavePublicKey}
const mongoose = require('mongoose');
const app = require('./app')
const dotenv = require("dotenv");
const { mongoUrl, serverPort } = require('./config/config');

dotenv.config();


const start = async () => {
    try {
      mongoose.connect(mongoUrl, {retryWrites: true, w: 'majority'}).then(() => {
          console.log('connected to mongoDb')
      })
      
      app.listen(serverPort, () => {
          console.log(`Server started on port ${serverPort}`);
        });

    } catch (error) {
        console.log('Unable to connect')
        console.log(error)
        process.exit(1);
    }
  };

  
void start();

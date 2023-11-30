const mongoose = require('mongoose');

// Define the company schema
const enquireSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String},
  email: { type: String, required: true },
  complaint:{ type:String, required:true },
  enquireDate: { type: Date, default: Date.now },
});

// Create a model for the enquire schema
const Enquire = mongoose.model('Enquire', enquireSchema);

module.exports = Enquire;

const mongoose = require('mongoose');

// Define the company schema
const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true },
  companyId: { type: String, required: true },
  staffStrength:{type:Number},
  location:{ type:String, required:true },
  currentLoan:{type:Number},
  expectedMonth:{type:Number},
  totalMiles:{type:Number}
  // branches: [
  //   {
  //     branchName: { type: String, required: true },
  //     branchAddress: { type: String, required: true },
  //   },
  // ],
});

// Create a model for the company schema
const Company = mongoose.model('Company', companySchema);

module.exports = Company;

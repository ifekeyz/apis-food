const mongoose = require('mongoose');

// Define the company schema
const clientCompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true },
  passwordHash: { type: String, required: true },
  staffStrength:{type:Number},
  address:{ type:String, default:'' },
  companyPhone:{type:String, default:''},
  companyLogo:{type:String, default:''},
  industryType:{type:String, default:''},
  verificationCode:{
      type:String,
      default:''
  },
  isApproved:{
      type:Boolean,
      default:false
  }
});

// Create a model for the company schema
const ClientCompany = mongoose.model('ClientCompany', clientCompanySchema);

module.exports = ClientCompany;

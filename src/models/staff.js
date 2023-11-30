const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  clientId:{type:String},
  email: { type: String, required: true },
  company:{ type:String, required:true},
  salary:{ type:Number, required:true},
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;

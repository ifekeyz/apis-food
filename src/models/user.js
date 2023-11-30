const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    passwordHash:{
        type: String,
        required: true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isMember:{
        type:Boolean,
        default:false
    },
    isApproved:{
        type:Boolean,
        default:false
    },
    isPayment:{
        type:Boolean,
        default:false
    },
    phonenumber:{
        type: String,
        default:''
    },
    address:{
        type: String,
        default:''
    },
    company:{
        type: String,
        default:''
    },
    image: { 
        type: String, 
        default: '' 
    },
    staffId: { 
        type: String, 
        default: '' 
    },
    jobtitle:{
        type: String,
        default:''
    },
    salary:{
        type: String,
        default:''
    },
    verificationCode:{
        type:String,
        default:''
    }
})
userSchema.virtual('id').get(function (){
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals:true,
})

exports.User = mongoose.model('User',userSchema);
exports.userSchema = userSchema;
const mongoose = require('mongoose');


const Regularization = new mongoose.Schema({
   
    RegularizationType: { type: String, required: false },
    RegularizationDate: { type: String, required: false },
    RegularizationPunchInTime: { type: String, required: false },
    employeecode: { type: String, required: false },
    RegularizationPunchOutTime: { type: String, required: false },
    Reason:{type:String},
    RegularizationStatus:{type:String}

});



const Regularizations= mongoose.model('Regularization',Regularization );
module.exports = Regularizations;

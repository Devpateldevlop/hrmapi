const mongoose = require('mongoose');

const LeaveBalanceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' } // Reference to Employee
});

const LeaveBalance = mongoose.model('LeaveBalance', LeaveBalanceSchema);
module.exports = LeaveBalance;

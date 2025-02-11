const mongoose = require('mongoose');

const PayslipSchema = new mongoose.Schema({
    month: { type: String, required: true },
    basicSalary: { type: Number, required: true },
    bonus: { type: Number, required: true },
    deductions: { type: Number, required: true },
    netSalary: { type: Number, required: true },
    paidDate: { type: Date, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' } // Reference to Employee
});

const Payslip = mongoose.model('Payslip', PayslipSchema);
module.exports = Payslip;

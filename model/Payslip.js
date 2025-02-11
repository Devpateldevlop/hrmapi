const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://pdev5771:rxHFzG2xPEkkocvM@cluster0.bso1d.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));
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

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://pdev5771:rxHFzG2xPEkkocvM@cluster0.bso1d.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));

const deductionSchema = new mongoose.Schema({
    Type: { type: String, default: '' },
    Amount: { type: Number, default: '' }
  });
  
  // Define the Payslip Schema
  const payslipSchema = new mongoose.Schema({
    Deductions: [deductionSchema],  
    LOP_LWP: { type: String, default: '' },
    NetEarning: { type: Number, default: '' },
    GrossEarning: { type: Number, default: '' },
    Month: { type: String, default: '' },
    BasicSalary: { type: Number, default: '' },
    NetSalary: { type: Number, default: '' },
    DeductionType: { type: String, default: '' },
    Amount: { type: Number, default: '' },
    Year: { type: String, default: '' },
    Bonuses: { type: Number, default: '' },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
  });

const Payslip = mongoose.model('Payslip', payslipSchema);
module.exports = Payslip;

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://pdev5771:rxHFzG2xPEkkocvM@cluster0.bso1d.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));

const deductionSchema = new mongoose.Schema({
    Type: { type: String, default: '' },
    Amount: { type: String, default: '' }
  });
  
  // Define the Payslip Schema
  const payslipSchema = new mongoose.Schema({
    Deductions: [deductionSchema],  
    LOP_LWP: { type: String, default: '' },
    NetEarning: { type: String, default: '' },
    GrossEarning: { type: String, default: '' },
    Month: { type: String, default: '' },
    basicSalary: { type: String, default: '' },
    netSalary: { type: String, default: '' },
    deductionType: { type: String, default: '' },
    amount: { type: String, default: '' },
    Year: { type: String, default: '' },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
  });

const Payslip = mongoose.model('Payslip', payslipSchema);
module.exports = Payslip;

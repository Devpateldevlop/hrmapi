const mongoose = require('mongoose');
const express = require('express');
const Payslip = require('../model/Payslip'); // Assuming model is in models folder
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*', // Allow all domains or restrict to your frontend's domain
    methods: ['GET', 'POST', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
}));
app.options('*', cors()); // This handles preflight requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));

app.get('/api/employee/payslip', async (req, res) => {
  try {
      const employeeCode = req.query.employeeCode;
      if (!employeeCode) {
          return res.status(400).json({ message: 'Employee code is required' });
      }
      const employee = await Payslip.findOne({ EmployeeCode: employeeCode }).populate('punchHistory');
      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json({
          message:'Payslip fetched successfully',
          payslip: employee.payslips
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err });
  }
});
app.post('/api/employee/:empcode/payslip', async (req, res) => {
    const { empcode } = req.params;
    const { month, basicSalary, bonus, deductions, netSalary, paidDate } = req.body;
  
    try {
      const employee = await Payslip.findOne({ Empcode: empcode });
  
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
  
      const newPayslip = new Payslip({ month, basicSalary, bonus, deductions, netSalary, paidDate, employee: employee._id });
      await newPayslip.save();
  
      employee.payslips.push(newPayslip);
      await employee.save();
  
      res.status(201).json({ message: 'Payslip added successfully', data: newPayslip });
    } catch (err) {
      res.status(500).json({ error: 'Error adding Payslip' });
    }
  });
  


app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
});

// Set up the server to listen on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

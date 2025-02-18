const mongoose = require('mongoose');
const express = require('express');
const Employee = require('../model/Employee');
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
      const employee = await Employee.findOne({ EmployeeCode: employeeCode }).populate('payslips');
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

app.post('/api/employee/payslip', async (req, res) => {
    try {
        const { employeeCode } = req.query;
        const {   
            Deductions,  
            LOP_LWP,
            NetEarning,
            GrossEarning,
            Month,
            basicSalary,
            netSalary,
            deductionType,
            amount,
            Year} = req.body;
      
        const employee = await Employee.findOne({ EmployeeCode: employeeCode });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const newPunchHistory = new Payslip({
            Deductions,  
            LOP_LWP,
            NetEarning,
            GrossEarning,
            Month,
            basicSalary,
            netSalary,
            deductionType,
            amount,
            Year,
            employee: employee._id  
        });
        const savedPunchHistory = await newPunchHistory.save();
        employee.payslips.push(savedPunchHistory._id);
        await employee.save();
        res.status(201).json({
            message: 'Payslip created successfully',
            punchHistory: savedPunchHistory
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
});

app.put('/api/employee/payslip', async (req, res) => {
    try {
        const { punchHistoryId } = req.query; 
        const { employeeCode } = req.query;    

        const { date, punchIn, punchOut, Inaddress, Outaddress } = req.body;

        // Validate required fields
        // if (!date || !punchIn || !punchOut || !Inaddress || !Outaddress) {
        //     return res.status(400).json({ message: 'Missing required fields' });
        // }

        // Find the employee by employeeCode
        const employee = await Employee.findOne({ EmployeeCode: employeeCode });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        // Find the punch history by its ID and update it
        const punchHistory = await PunchHistory.findById(punchHistoryId);

        if (!punchHistory) {
            return res.status(404).json({ message: 'Punch history not found' });
        }

        if (date) punchHistory.date = date;
        if (punchIn) punchHistory.punchIn = punchIn;
        if (punchOut) punchHistory.punchOut = punchOut;
        if (Inaddress) punchHistory.Inaddress = Inaddress;
        if (Outaddress) punchHistory.Outaddress = Outaddress;
        
        const updatedPunchHistory = await punchHistory.save();
        
        res.status(200).json({
            message: 'Punch history updated successfully',
            punchHistory: updatedPunchHistory
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
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

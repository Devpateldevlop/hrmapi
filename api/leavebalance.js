const mongoose = require('mongoose');
const express = require('express');
const PunchHistory = require('../model/Leavebalance'); // Assuming model is in models folder
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

app.post('/api/employee/:empcode/leaveBalance', async (req, res) => {
    const { empcode } = req.params;
    const { name, value } = req.body;
  
    try {
      const employee = await Employee.findOne({ Empcode: empcode });
  
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
  
      const newLeaveBalance = new LeaveBalance({ name, value, employee: employee._id });
      await newLeaveBalance.save();
  
      employee.leaveBalance.push(newLeaveBalance);
      await employee.save();
  
      res.status(201).json({ message: 'LeaveBalance added successfully', data: newLeaveBalance });
    } catch (err) {
      res.status(500).json({ error: 'Error adding LeaveBalance' });
    }
  });
  

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));

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

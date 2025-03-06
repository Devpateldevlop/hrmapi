const mongoose = require('mongoose');
const express = require('express');
const Employee = require('../model/Employee');
const Leavebalance = require('../model/Leavebalance'); // Assuming model is in models folder
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*', // Allow all domains or restrict to your frontend's domain
    methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allow ed headers
}));
app.options('*', cors()); // This handles preflight requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/api/employee/leaveBalance', async (req, res) => {
    try {
        const punchHistories = await Leavebalance.find();
        res.status(200).json(punchHistories); // Send retrieved data back
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving punch history' });
    }

  });
app.post('/api/employee/leaveBalance', async (req, res) => {
    const { empcode } = req.query;
    const { type, days } = req.body;
    var name=type;
    const leaveBal = await Leavebalance.findOne({type:name});
    if(leaveBal){
      try {
        const employee = await Employee.findOne({ EmployeeCode: parseInt(empcode) });
  
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
  
        const leaveBal = await Leavebalance.findById(id);
        if (!leaveBal) return res.status(404).json({ error: 'LeaveBalance not found' });
  
        leaveBal.type = type;
        leaveBal.days = days;
  
        const leaveBalance1= await leaveBal.save();
  
        res.status(200).json({ message: 'LeaveBalance updated successfully', data: leaveBalance1 });
      } catch (err) {
        res.status(500).json({ error: 'Error updating LeaveBalance' });
      }
      
    } 
    else{
    try {
      const employee = await Employee.findOne({ EmployeeCode: parseInt(empcode) });
  
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
  
      const newLeaveBalance = new Leavebalance({ type, days, employee: employee._id });
      await newLeaveBalance.save();
  
      employee.leaveBalance.push(newLeaveBalance);
      await employee.save();
  
      res.status(201).json({ message: 'LeaveBalance added successfully', data: newLeaveBalance });
    } catch (err) {
      res.status(500).json({ error: 'Error adding LeaveBalance' });
    }
  }
  });
  
  app.put('/api/employee/leaveBalance', async (req, res) => {
    const { empcode, id } = req.query;
    const { type, days } = req.body;

    try {
      const employee = await Employee.findOne({ EmployeeCode: parseInt(empcode) });

      if (!employee) return res.status(404).json({ error: 'Employee not found' });

      const leaveBal = await Leavebalance.findById(id);
      if (!leaveBal) return res.status(404).json({ error: 'LeaveBalance not found' });

      leaveBal.type = type;
      leaveBal.days = days;

      const leaveBalance1= await leaveBal.save();

      res.status(200).json({ message: 'LeaveBalance updated successfully', data: leaveBalance1 });
    } catch (err) {
      res.status(500).json({ error: 'Error updating LeaveBalance' });
    }
  });

  app.delete('/api/employee/leaveBalance', async (req, res) => {
    const { empcode, type } = req.query;

    try {
      const employee = await Employee.findOne({ EmployeeCode: parseInt(empcode) });

      if (!employee) return res.status(404).json({ error: 'Employee not found' });

      const leaveBalance = await Leavebalance.findOneAndDelete(type); 
      if (!leaveBalance) return res.status(404).json({ error: 'LeaveBalance not found' });

      res.status(200).json({ message: 'LeaveBalance deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Error deleting LeaveBalance' });
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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PUT,DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
});

// Set up the server to listen on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

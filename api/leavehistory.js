const mongoose = require('mongoose');
const express = require('express');
const Leavehistory = require('../model/Leavehistory'); // Assuming model is in models folder
const cors = require('cors');
const app = express();

const Employee = require('../model/Employee');
const PunchHistory = require('../model/PunchHistory')

app.use(cors({
    origin: '*', // Allow all domains or restrict to your frontend's domain
    methods: ['GET', 'POST','PUT', 'OPTIONS'], // Allowed HTTP methods
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

app.post('/api/employee/leaveHistory', async (req, res) => {
  const { empcode } = req.query;
  const { LeaveType, LeaveBalance, FromDate, FromDateDayType, ToDate, ToDateDayType, TotalLeaveDay, Remarks, EmailNotificationTo, Attachment,   lastName, firstName, employeecode, stat, appliedDateTime,docNo ,Email} = req.body;
  
  try {
    const employee = await Employee.findOne({ EmployeeCode: empcode});
  
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
  
    const newLeaveHistory = new Leavehistory({ 
      LeaveType, 
      LeaveBalance, 
      FromDate, 
      FromDateDayType, 
      ToDate, 
      ToDateDayType, 
      TotalLeaveDay, 
      Remarks, 
      EmailNotificationTo, 
      Attachment, 
      lastName,
      firstName,
      employeecode,
      stat,
      appliedDateTime,
      docNo,
      Email,
      employee: employee._id 
    });
    await newLeaveHistory.save();
  
    employee.leaveHistory.push(newLeaveHistory);
    await employee.save();
  
    res.status(201).json({ message: 'LeaveHistory added successfully', data: newLeaveHistory });
  } catch (err) {
    res.status(500).json({ error: 'Error adding LeaveHistory' });
  }
});

app.put('/api/employee/leaveHistory', async (req, res) => {
  const { id, empcode } = req.query;
  const { LeaveType, LeaveBalance, docNo, FromDate, Email, FromDateDayType, ToDate, ToDateDayType, TotalLeaveDay, Remarks, EmailNotificationTo, Attachment, lastName, firstName, employeecode, stat, appliedDateTime } = req.body;

  try {
    const employee = await Employee.find({ EmployeeCode: parseInt(empcode) });

    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const leaveHistory = await Leavehistory.findById(id);

    if (!leaveHistory) return res.status(404).json({ error: 'LeaveHistory not found' });

    if (LeaveType) leaveHistory.LeaveType = LeaveType;
    if (LeaveBalance) leaveHistory.LeaveBalance = LeaveBalance;
    if (FromDate) leaveHistory.FromDate = FromDate;
    if (FromDateDayType) leaveHistory.FromDateDayType = FromDateDayType;
    if (ToDate) leaveHistory.ToDate = ToDate;
    if (ToDateDayType) leaveHistory.ToDateDayType = ToDateDayType;
    if (TotalLeaveDay) leaveHistory.TotalLeaveDay = TotalLeaveDay;
    if (Remarks) leaveHistory.Remarks = Remarks;
    if (EmailNotificationTo) leaveHistory.EmailNotificationTo = EmailNotificationTo;
    if (Attachment) leaveHistory.Attachment = Attachment;
    if (lastName) leaveHistory.lastName = lastName;
    if (firstName) leaveHistory.firstName = firstName;
    if (employeecode) leaveHistory.employeecode = employeecode;
    if (stat) leaveHistory.stat = stat;
    if (appliedDateTime) leaveHistory.appliedDateTime = appliedDateTime;
    if (docNo) leaveHistory.docNo = docNo;
    if (Email) leaveHistory.Email = Email;
    
    await leaveHistory.save();

    res.status(200).json({ message: 'LeaveHistory updated successfully', data: leaveHistory });
  } catch (err) {
    res.status(500).json({ error: 'Error updating LeaveHistory' });
  }
});
//   const { empcode} = req.query;
  
//   try {
//     const employee = await Employee.findOne({ Empcode: empcode }).populate({'leaveHistory'});
  
//     if (!employee) return res.status(404).json({ error: 'Employee not found' });
  
//     res.status(200).json({ leaveHistory: employee.leaveHistory });
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching LeaveHistory' });
//   }
// });
  
// app.get('/api/employee/leaveHistory', async (req, res) => {
//   try {
//     const leaveHistories = await Leavehistory.find()
//     res.status(200).json({ leaveHistories });
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching LeaveHistory' });
//   }
// });

app.get('/api/employee/leaveHistory', async (req, res) => {
  if(Object.keys(req.query).length != 0)
  {
    const { empcode } = req.query;
    const employeecode1=parseInt(empcode);
    try {
      const employee = await Employee.find({ EmployeeCode: employeecode1})
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
      const LeaveH = await  Leavehistory.find({employeecode:employeecode1})// Assuming model is in models folder
      
      res.status(200).json({leaveHistory:LeaveH});
    } catch (err) {
      res.status(500).json({ error: 'Error fetching LeaveHistory' });
    }

  }else
  {
    try {
          const leaveHistories = await Leavehistory.find()
          res.status(200).json({ leaveHistories });
        } catch (err) {
          res.status(500).json({ error: 'Error fetching LeaveHistory' });
        }
  }
});

app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
});

// Set up the server to listen on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




 
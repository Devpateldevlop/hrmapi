const mongoose = require('mongoose');
const express = require('express');
const Employee = require('../model/Employee'); // Assuming model is in models folder
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*', // Allow all domains or restrict to your frontend's domain
    methods: ['GET', 'POST','PUT','DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
}));
app.options('*', cors()); // This handles preflight requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));

app.post('/api/employee', async (req, res) => {
  const { EmployeeCode, profile } = req.body;

  // Validate that EmployeeCode and required fields are present
  if (!EmployeeCode) {
      return res.status(400).json({ error: 'EmployeeCode is required' });
  }

  if (!profile || !profile.firstName || !profile.lastName || !profile.Email) {
      return res.status(400).json({ error: 'Required profile fields are missing' });
  }

  try {
      // Check if an employee with the same EmployeeCode already exists
      const existingEmployee = await Employee.findOne({ EmployeeCode });
      if (existingEmployee) {
          return res.status(400).json({ error: 'Employee with this EmployeeCode already exists' });
      }

      const newEmployee = new Employee({ EmployeeCode, profile });
      await newEmployee.save();
      const allEmployees = await Employee.find();
      res.status(201).json({ message: 'Employee created successfully', data: allEmployees });
  } catch (err) {
      console.error('Error creating employee:', err);
      res.status(500).json({ error: 'Error creating Employee' });
  }
});


app.put('/api/employee', async (req, res) => {

    const { employeeCode } = req.query;  
    const employee = await Employee.findOne({ EmployeeCode: employeeCode });

    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    employee.profile = req.body.profile;
    await employee.save();
    res.status(200).json({ message: 'Employee updated successfully', data: employee });
});

app.delete('/api/employee', async (req, res) => {
    const { employeeCode } = req.query;
    try {
        const employee = await Employee.findOneAndDelete({ EmployeeCode: employeeCode });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        } 
      const allEmployees = await Employee.find();

        res.status(200).json({ message: 'Employee deleted successfully',data:allEmployees });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ error: 'Error deleting Employee' });
    }
});
;
  app.get('/api/employee', async (req, res) => {
    try {
        const punchHistories = await Employee.find();
        res.status(200).json(punchHistories);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving punch history' });
    }

  });
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

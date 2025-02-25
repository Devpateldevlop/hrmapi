const express = require('express');
const Deduction = require('../model/deduction');
const mongoose = require('mongoose');
// const express = require('express');
const Employee = require('../model/Employee');
// const PunchHistory = require('../model/PunchHistory'); 
const cors = require('cors');
// const calendar = require('../model/calendar');
const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT','OPTIONS'], 
    allowedHeaders: ['Content-Type'], 
}));

app.options('*', cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));

// Create a new deduction
app.post('/api/employee/Deduction', async (req, res) => {
    try {
        const { employeeCode } = req.query;
        const { name,amount,description} = req.body;
     
        const employee = await Employee.findOne({ EmployeeCode: employeeCode });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
      
        const newPunchHistory = new Deduction.findOneAndUpdate(
            {name},
            {amount,description,
            employee: employee._id },
        { new: true, upsert: true }  
    );

        const savedPunchHistory = await newPunchHistory.save();
        employee.deduction.push(savedPunchHistory._id);
        await employee.save();
        res.status(201).json({
            message: 'Deduction created successfully',
            Deduction: savedPunchHistory
        });
        
        // const deduction = new Deduction(req.body);
        // await deduction.save();
        // res.status(201).send(deduction);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all deductions
app.get('/api/employee/Deduction', async (req, res) => {
    try {

        const employeeCode = req.query.employeeCode;
        if (!employeeCode) {
            return res.status(400).json({ message: 'Employee code is required' });
        }
        const employee = await Employee.findOne({ EmployeeCode: employeeCode }).populate('deduction');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({
            message: 'Deduction fetched successfully',
            Deduction: employee.deduction
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a deduction by ID
app.get('/api/employee/Deduction', async (req, res) => {
    try {
        const deduction = await Deduction.findById(req.params.id);
        if (!deduction) {
            return res.status(404).send();
        }
        res.status(200).send(deduction);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a deduction by ID
app.put('/api/employee/Deduction', async (req, res) => {
    const { id } = req.query;
    const { employeeCode } = req.query;    
    const { name, amount, description } = req.body;

    try {
        const deduction = await Deduction.findById(id);
        if (!deduction) {
            return res.status(404).json({ message: 'Deduction not found' });
        }

        if (name) deduction.name = name;
        if (amount) deduction.amount = amount;
        if (description) deduction.description = description;

        const updatedDeduction = await deduction.save();
        res.status(200).json({
            message: 'Deduction updated successfully',
            Deduction: updatedDeduction
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a deduction by ID
app.delete('/api/employee/Deduction', async (req, res) => {
    try {
        const deduction = await Deduction.findByIdAndDelete(req.params.id);
        if (!deduction) {
            return res.status(404).send();
        }
        res.status(200).send(deduction);
    } catch (error) {
        res.status(500).send(error);
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

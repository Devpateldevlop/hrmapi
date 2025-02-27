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
    methods: ['GET', 'POST', 'PUT','DELETE','OPTIONS'], 
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
        const { name, amount, description } = req.body;

        let employee = await Employee.findOne({ EmployeeCode: employeeCode });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        let deduction = await Deduction.findOne({ employee: employee._id, name });
        if (deduction) {
            // Update existing deduction
            if (amount) deduction.amount = amount;
            if (description) deduction.description = description;
            const updatedDeduction = await deduction.save();
            return res.status(200).json({
                message: 'Deduction updated successfully',
                Deduction: updatedDeduction
            });
        } else {
            // Create new deduction
            const newDeduction = new Deduction({
                name,
                amount,
                description,
                employee: employee._id
            });

            const savedDeduction = await newDeduction.save();
            employee.deduction.push(savedDeduction._id);
            await employee.save();

            return res.status(201).json({
                message: 'Deduction created successfully',
                Deduction: savedDeduction
            });
        }
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

app.delete('/api/employee/Deduction', async (req, res) => {
    try {
        const { employeeCode, id } = req.query;

        if (!employeeCode || !id) {
            return res.status(400).json({ message: 'Employee code and deduction ID are required' });
        }

        const employee = await Employee.findOne({ EmployeeCode: employeeCode });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const deduction = await Deduction.findOneAndDelete({ name: id, employee: employee._id });
        if (!deduction) {
            return res.status(404).json({ message: 'Deduction not found' });
        }

        // Remove the deduction reference from the employee document
        employee.deduction.pull(deduction._id);
        await employee.save();

        res.status(200).json({ message: 'Deduction deleted successfully', Deduction: deduction });
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

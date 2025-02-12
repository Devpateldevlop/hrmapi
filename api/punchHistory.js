const mongoose = require('mongoose');
const express = require('express');
const Employee = require('../model/Employee');
const PunchHistory = require('../model/PunchHistory'); // Assuming model is in models folder
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

// Handle GET request for punch history
// GET: Fetch the punch history for a particular employee using EmployeeCode
app.get('api/employee/PunchHistory/:employeeCode', async (req, res) => {
    try {
        const { employeeCode } = req.params; // Extract employeeCode from URL parameter
        
        // Find the employee by EmployeeCode and populate their punchHistory
        const employee = await Employee.findOne({ EmployeeCode: employeeCode }).populate('punchHistory');
        
        // If employee is not found, return 404
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Send the employee's punch history
        res.status(200).json({
            message: 'Punch history fetched successfully',
            punchHistory: employee.punchHistory
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
});


// Handle POST request to create new punch history
// app.post('/api/punchHistory', async (req, res) => {
//     // Destructure request body
//     const { date, punchIn, punchOut, Inaddress, Outaddress } = req.body;

//     // Validate the incoming data (ensure all fields are provided)
//     if (!date || !punchIn || !punchOut || !Inaddress || !Outaddress) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     try {
//         const newPunchRecord = new PunchHistory({
//             date, punchIn, punchOut, Inaddress, Outaddress
//         });

       
//         await newPunchRecord.save();
        
       
//         res.status(201).json({
//             message: 'Punch history created successfully',
//             data: newPunchRecord,
//         });
//     } catch (err) {
//         console.error('Error saving punch history:', err);
//         res.status(500).json({ error: 'Error saving punch history' });
//     }
// });



// Create Punch History for a particular employee
app.post('/PunchHistory/:employeeCode', async (req, res) => {
    try {
        // Find the employee by EmployeeCode
        const employee = await Employee.findOne({ EmployeeCode: req.params.employeeCode });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Create a new punch history entry
        const { punchInTime, punchOutTime, date } = req.body;
        
        const newPunchHistory = new PunchHistory({
            employee: employee._id,  // Store the reference to the Employee model
            punchInTime,
            punchOutTime,
            date
        });

        // Save the punch history
        const savedPunchHistory = await newPunchHistory.save();

        // Update the employee's punch history array
        employee.punchHistory.push(savedPunchHistory._id);
        await employee.save();

        res.status(201).json({ message: 'Punch history added successfully', savedPunchHistory });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
});
// Handle OPTIONS requests for CORS preflight
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

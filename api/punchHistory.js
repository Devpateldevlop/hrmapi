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
app.get('/api/employee/PunchHistory', async (req, res) => {
    try {
        const employeeCode = req.query.employeeCode;
        if (!employeeCode) {
            return res.status(400).json({ message: 'Employee code is required' });
        }
        const employee = await Employee.findOne({ EmployeeCode: employeeCode }).populate('punchHistory');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({
            message: 'Punch history fetched successfully',
            punchHistory: employee.punchHistory
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
});

app.post('/api/employee/PunchHistory', async (req, res) => {
    try {
        const { employeeCode } = req.query;
        const { date, punchIn, punchOut, Inaddress, Outaddress } = req.body;
        if (!date || !punchIn || !punchOut || !Inaddress || !Outaddress) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const employee = await Employee.findOne({ EmployeeCode: employeeCode });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const newPunchHistory = new PunchHistory({
            date,
            punchIn,
            punchOut,
            Inaddress,
            Outaddress,
            employee: employee._id  
        });
        const savedPunchHistory = await newPunchHistory.save();
        employee.punchHistory.push(savedPunchHistory._id);
        await employee.save();
        res.status(201).json({
            message: 'Punch history created successfully',
            punchHistory: savedPunchHistory
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
});


app.put('/api/employee/PunchHistory', async (req, res) => {
    try {
        const { punchHistoryId } = req.params;  // Get the punchHistoryId from the URL parameters
        const { employeeCode } = req.query;    // Get the employeeCode from the query parameters

        // Get the updated punch history data from the request body
        const { date, punchIn, punchOut, Inaddress, Outaddress } = req.body;

        // Validate required fields
        if (!date || !punchIn || !punchOut || !Inaddress || !Outaddress) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

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

        // Update the punch history fields
        punchHistory.date = date;
        punchHistory.punchIn = punchIn;
        punchHistory.punchOut = punchOut;
        punchHistory.Inaddress = Inaddress;
        punchHistory.Outaddress = Outaddress;

        // Save the updated punch history to the database
        const updatedPunchHistory = await punchHistory.save();

        // Send a success response with the updated punch history data
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

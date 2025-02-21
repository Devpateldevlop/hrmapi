const mongoose = require('mongoose');
const express = require('express');
const Employee = require('../model/Employee');
const PunchHistory = require('../model/PunchHistory'); 
const cors = require('cors');
const calendar = require('../model/calendar');
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
        

        employee.masterholiday = await calendar.find();

        const getSundaysAndEvenSaturdays = (year) => {
            const result = {};
            for (let month = 0; month < 12; month++) {
              const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
              result[monthName] = {
                sundays: [],
                evenSaturdays: [],
              };
              const daysInMonth = new Date(year, month + 1, 0).getDate();
          
              for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dayOfWeek = date.getDay(); 
          
                if (dayOfWeek === 0) {
                  result[monthName].sundays.push(day);
                }
          
                if (dayOfWeek === 6 && day % 2 === 0) {
                  result[monthName].evenSaturdays.push(day);
                }
              }
            }
          
            return result;
          };
          const year = 2025;
          const sundaysAndEvenSaturdays = getSundaysAndEvenSaturdays(year);
          console.log(sundaysAndEvenSaturdays);
        res.status(200).json({
            message: 'Punch history fetched successfully',
            punchHistory: employee.punchHistory,
            masterholiday: employee.masterholiday
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
      
        const employee = await Employee.findOne({ EmployeeCode: employeeCode });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
    
        // var employee = await Employee.findOne({ EmployeeCode: employeeCode }).populate('punchHistory');
  

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

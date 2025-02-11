const mongoose = require('mongoose');
const express = require('express');
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
app.get('/api/punchHistory', async (req, res) => {
    try {
        const punchHistories = await PunchHistory.find();
        res.status(200).json(punchHistories); // Send retrieved data back
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving punch history' });
    }
});

// Handle POST request to create new punch history
app.post('/api/punchHistory', async (req, res) => {
    // Destructure request body
    const { date, punchIn, punchOut, Inaddress, Outaddress } = req.body;

    // Validate the incoming data (ensure all fields are provided)
    if (!date || !punchIn || !punchOut || !Inaddress || !Outaddress) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newPunchRecord = new PunchHistory({
            date, punchIn, punchOut, Inaddress, Outaddress
        });

       
        await newPunchRecord.save();
        
       
        res.status(201).json({
            message: 'Punch history created successfully',
            data: newPunchRecord,
        });
    } catch (err) {
        console.error('Error saving punch history:', err);
        res.status(500).json({ error: 'Error saving punch history' });
    }
});

app.post('/api/employee/:empcode/punchHistory', async (req, res) => {
    const { empcode } = req.params;
    const { date, punchIn, punchOut, Inaddress, Outaddress } = req.body;
  
    try {
      const employee = await PunchHistory.findOne({ Empcode: empcode });
  
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
  
      const newPunchHistory = new PunchHistory({ date, punchIn, punchOut, Inaddress, Outaddress, employee: employee._id });
      await newPunchHistory.save();
  
      employee.punchHistory.push(newPunchHistory);
      await employee.save();
  
      res.status(201).json({ message: 'PunchHistory added successfully', data: newPunchHistory });
    } catch (err) {
      res.status(500).json({ error: 'Error adding PunchHistory' });
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

const mongoose = require('mongoose');
const express = require('express');
const calendar = require('../model/calendar'); // Assuming model is in models folder
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*', // Allow all domains or restrict to your frontend's domain
    methods: ['GET', 'POST', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
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

app.get('/api/calendar', async (req, res) => {
    try {
        const calendar1 = await calendar.find();
        res.status(200).json({ message: 'calendar fetched successfully', data: calendar1 });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching calendar' });
    }
});
app.post('/api/calendar', async (req, res) => {
    const { date, type, name } = req.body;
  
    try {
      const calendar1 = new calendar({ date, type, name });
      await calendar1.save();
  
      res.status(201).json({ message: 'LeaveHistory added successfully', data: calendar1 });
    } catch (err) {
      res.status(500).json({ error: 'Error adding LeaveHistory' });
    }
  });
  

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

const mongoose = require('mongoose');
const express = require('express');
const Employee = require('../model/Employee'); // Assuming model is in models folder
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


app.post('/api/employee', async (req, res) => {
    const { Empcode, profile } = req.body;
  
    try {
      const newEmployee = new Employee({ Empcode, profile });
      await newEmployee.save();
      res.status(201).json({ message: 'Employee created successfully', data: newEmployee });
    } catch (err) {
      res.status(500).json({ error: 'Error creating Employee' });
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

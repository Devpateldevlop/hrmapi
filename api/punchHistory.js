const mongoose = require('mongoose');
const express = require('express');
const PunchHistory = require('../model/PunchHistory'); // Assuming model is in models folder
const cors = require('cors');
const app = express();


app.use(cors({
    origin: '*', // Your frontend domain
    methods: ['GET', 'POST', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
}));
app.options('*', cors()); // This handles preflight requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


app.get('/api/punchHistory', async (req, res) => {
    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Handle preflight
      }
    try {
        const punchHistories = await PunchHistory.find();
        res.status(200).json(punchHistories);
      } catch (err) {
        res.status(500).json({ error: 'Error retrieving punch history' });
      }
});

// app.create('/api/punchHistory', async (req, res) => {
//     if (req.method === 'OPTIONS') {
//         return res.status(200).end(); // Handle preflight
//       }
//     try {
//         const punchHistories = await PunchHistory.find();
//         res.status(200).json(punchHistories);
//       } catch (err) {
//         res.status(500).json({ error: 'Error retrieving punch history' });
//       }
// });


module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust the CORS origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end(); // Handle preflight request
    }
  
    if (req.method === 'POST') {
      const { date, punchIn, punchOut,Inaddress,Outaddress } = req.body;
  
      try {
        const newPunchRecord = new PunchHistory({
            date, punchIn, punchOut, Inaddress, Outaddress
        });
  
        await newPunchRecord.save(); // Save data to MongoDB
        res.status(201).json({ message: 'Punch history created', data: newPunchRecord });
      } catch (err) {
        res.status(500).json({ error: 'Error saving punch history' });
      }
    } else if (req.method === 'GET') {
      try {
        const punchHistories = await PunchHistory.find();
        res.status(200).json(punchHistories);
      } catch (err) {
        res.status(500).json({ error: 'Error retrieving punch history' });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  };
  
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});








